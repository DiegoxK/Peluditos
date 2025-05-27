"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type RefObject,
  type ChangeEvent,
} from "react";

import { type Crop } from "react-image-crop";

import { cn, cropImage, type CropImageOptions } from "@/lib/utils";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X as XIcon } from "lucide-react";

// --- Types ---
export interface ImageCropRootProps {
  value?: Blob | string | null;
  onChange: (blob: Blob | null) => void;
  children: ReactNode;
  aspectRatio?: number;
  maxFileSizeMB?: number;
  acceptedMimeTypes?: string[];
  outputOptions?: CropImageOptions;
}

export interface ImageCropContextType {
  originalFileSrc: string | null;
  croppedBlobUrl: string | null;
  livePreviewBlobUrl: string | null;
  isPreviewLoading: boolean;
  currentCrop?: Crop;
  isCropperUIVisible: boolean;
  isLoading: boolean;
  error: string | null;
  aspectRatio?: number;
  acceptedMimeTypes?: string[];
  hasAppliedImage: boolean;

  imgRef: RefObject<HTMLImageElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;

  setCurrentCrop: Dispatch<SetStateAction<Crop | undefined>>;
  updateLivePreview: (completedCrop: Crop) => Promise<void>;
  handleFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  applyCropAndClose: () => Promise<void>;
  clearImageAndClose: () => void;
  closeCropperUI: () => void;
  triggerFileInput: () => void;
  setError: Dispatch<SetStateAction<string | null>>;
  setIsCropperUIVisible: Dispatch<SetStateAction<boolean>>;
}

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

const ImageCropContext = createContext<ImageCropContextType | null>(null);

export const useImageCrop = () => {
  const context = useContext(ImageCropContext);
  if (!context) {
    throw new Error(
      "useImageCrop must be used within an ImageCropRoot provider",
    );
  }
  return context;
};

// --- ImageCropRoot ---
export const ImageCropRoot: React.FC<ImageCropRootProps> = ({
  children,
  value,
  onChange,
  aspectRatio,
  maxFileSizeMB = 4,
  acceptedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  outputOptions = { outputType: "image/webp", outputQuality: 0.8 },
}) => {
  const [isCropperUIVisible, setIsCropperUIVisible] = useState(false);

  const [trueOriginalFile, setTrueOriginalFile] = useState<File | null>(null);
  const [initialDbUrl, setInitialDbUrl] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalFileSrc, setOriginalFileSrc] = useState<string | null>(null);

  const [croppedBlobUrl, setCroppedBlobUrl] = useState<string | null>(null);

  const [livePreviewBlob, setLivePreviewBlob] = useState<Blob | null>(null);
  const [livePreviewBlobUrl, setLivePreviewBlobUrl] = useState<string | null>(
    null,
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [currentCrop, setCurrentCrop] = useState<Crop | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAppliedImage = !!(croppedBlobUrl ?? initialDbUrl);

  useEffect(() => {
    setError(null);
    if (typeof value === "string" && value) {
      setCroppedBlobUrl(value);
      setInitialDbUrl(value);

      setTrueOriginalFile(null);
      setOriginalFile(null);
      setLivePreviewBlob(null);
    } else if (value instanceof Blob) {
      const blobUrl = URL.createObjectURL(value);
      setCroppedBlobUrl(blobUrl);

      setTrueOriginalFile(
        new File([value], "initial-blob.bin", { type: value.type }),
      );
      setInitialDbUrl(null);
      setLivePreviewBlob(null);
    } else {
      setCroppedBlobUrl(null);
      setInitialDbUrl(null);

      setTrueOriginalFile(null);
      setOriginalFile(null);
      setLivePreviewBlob(null);
    }
  }, [value]);

  useEffect(() => {
    if (!originalFile) {
      if (originalFileSrc) URL.revokeObjectURL(originalFileSrc);
      setOriginalFileSrc(null);
      return;
    }
    const newUrl = URL.createObjectURL(originalFile);
    setOriginalFileSrc(newUrl);
    return () => URL.revokeObjectURL(newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalFile]);

  useEffect(() => {
    if (!livePreviewBlob) {
      if (livePreviewBlobUrl) URL.revokeObjectURL(livePreviewBlobUrl);
      setLivePreviewBlobUrl(null);
      return;
    }
    const newUrl = URL.createObjectURL(livePreviewBlob);
    setLivePreviewBlobUrl(newUrl);
    return () => URL.revokeObjectURL(newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePreviewBlob]);

  const fetchAndSetImageForCropping = useCallback(
    async (imageUrl: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(imageUrl);
        if (!response.ok)
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        const blobData = await response.blob();
        const fileName =
          imageUrl.substring(imageUrl.lastIndexOf("/") + 1) || "image_from_db";
        const fileFromDb = new File([blobData], fileName, {
          type: blobData.type || "application/octet-stream",
        });

        setTrueOriginalFile(fileFromDb);
        setOriginalFile(fileFromDb);
        setCurrentCrop(undefined);
        setLivePreviewBlob(null);
      } catch (e) {
        console.error("Error fetching image for cropping:", e);
        setError(
          "Could not load image for adjustment. Please select a new one.",
        );
        setIsCropperUIVisible(false);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsCropperUIVisible],
  );

  useEffect(() => {
    if (isCropperUIVisible && hasAppliedImage && !originalFile) {
      if (trueOriginalFile) {
        setOriginalFile(trueOriginalFile);
        setCurrentCrop(undefined);
        setLivePreviewBlob(null);
        setError(null);
      } else if (initialDbUrl) {
        void fetchAndSetImageForCropping(initialDbUrl);
      }
    } else if (!isCropperUIVisible && originalFile) {
      setOriginalFile(null);
    }
  }, [
    isCropperUIVisible,
    trueOriginalFile,
    initialDbUrl,
    originalFile,
    hasAppliedImage,
    fetchAndSetImageForCropping,
  ]);

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setLivePreviewBlob(null);
      const file = event.target.files?.[0];
      if (event.target.value) event.target.value = "";

      if (!file) return;
      if (!acceptedMimeTypes.includes(file.type)) {
        setError(`Invalid type. Accepted: ${acceptedMimeTypes.join(", ")}`);
        return;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File too large. Max: ${maxFileSizeMB}MB`);
        return;
      }

      setTrueOriginalFile(file);
      setOriginalFile(file);

      setCroppedBlobUrl(null);
      setInitialDbUrl(null);
      onChange(null);
      setCurrentCrop(undefined);
      setIsCropperUIVisible(true);
    },
    [acceptedMimeTypes, maxFileSizeMB, onChange, setIsCropperUIVisible],
  );

  const updateLivePreview = useCallback(
    async (completedCrop: Crop) => {
      if (
        !imgRef.current ||
        !completedCrop ||
        completedCrop.width === 0 ||
        completedCrop.height === 0
      ) {
        setLivePreviewBlob(null);
        return;
      }
      setIsPreviewLoading(true);
      try {
        const previewOutputOpts = {
          ...outputOptions,
          quality: outputOptions.outputQuality
            ? Math.max(0.5, outputOptions.outputQuality * 0.7)
            : 0.7,
          type: outputOptions.outputType ?? "image/jpeg",
        };
        const blob = await cropImage(
          imgRef.current,
          completedCrop,
          previewOutputOpts,
        );
        setLivePreviewBlob(blob ?? null);
      } catch (e) {
        console.error("Error updating live preview:", e);
        setLivePreviewBlob(null);
      } finally {
        setIsPreviewLoading(false);
      }
    },
    [outputOptions],
  );

  const applyCropAndClose = useCallback(async () => {
    if (!originalFile || !currentCrop || !imgRef.current) {
      setError("Cannot apply: missing data.");
      return;
    }
    if (currentCrop.width === 0 || currentCrop.height === 0) {
      setError("Cannot apply: crop dimensions zero.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const blob = await cropImage(imgRef.current, currentCrop, outputOptions);
      if (blob) {
        onChange(blob);
        setInitialDbUrl(null);
        setOriginalFile(null);
        setLivePreviewBlob(null);
        setIsCropperUIVisible(false);
      } else {
        setError("Failed to crop image.");
      }
    } catch (e) {
      console.error("Error applying crop:", e);
      setError("Error during crop.");
    } finally {
      setIsLoading(false);
    }
  }, [
    originalFile,
    currentCrop,
    onChange,
    outputOptions,
    setIsCropperUIVisible,
  ]);

  const clearImageAndClose = useCallback(() => {
    setTrueOriginalFile(null);
    setOriginalFile(null);
    setInitialDbUrl(null);
    setCurrentCrop(undefined);
    setLivePreviewBlob(null);
    setError(null);
    setIsLoading(false);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsCropperUIVisible(false);
  }, [onChange, setIsCropperUIVisible]);

  const closeCropperUI = useCallback(() => {
    setIsCropperUIVisible(false);
    if (originalFile === trueOriginalFile) {
      if (!hasAppliedImage && trueOriginalFile) {
        setTrueOriginalFile(null);
      }
      setOriginalFile(null);
    }
    setLivePreviewBlob(null);
    setError(null);
  }, [setIsCropperUIVisible, originalFile, trueOriginalFile, hasAppliedImage]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const contextValue: ImageCropContextType = {
    originalFileSrc,
    croppedBlobUrl,
    livePreviewBlobUrl,
    isPreviewLoading,
    currentCrop,
    isCropperUIVisible,
    isLoading,
    error,
    aspectRatio,
    acceptedMimeTypes,
    hasAppliedImage,
    imgRef,
    fileInputRef,
    setCurrentCrop,
    updateLivePreview,
    handleFileSelect,
    applyCropAndClose,
    clearImageAndClose,
    closeCropperUI,
    triggerFileInput,
    setError,
    setIsCropperUIVisible,
  };

  return (
    <ImageCropContext.Provider value={contextValue}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedMimeTypes?.join(",")}
        style={{ display: "none" }}
        aria-hidden="true"
      />
      {children}
    </ImageCropContext.Provider>
  );
};

// --- ImageCrop.Trigger ---
export type ImageCropTriggerProps = ButtonProps;
export const ImageCropTrigger = React.forwardRef<
  HTMLButtonElement,
  ImageCropTriggerProps
>(({ onClick, children, disabled, ...props }, ref) => {
  const {
    triggerFileInput,
    setIsCropperUIVisible,
    isCropperUIVisible,
    hasAppliedImage,
    originalFileSrc,
  } = useImageCrop();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hasAppliedImage && !originalFileSrc && !isCropperUIVisible) {
      setIsCropperUIVisible(true);
    } else {
      triggerFileInput();
    }
    onClick?.(event);
  };
  const buttonText =
    children ?? (hasAppliedImage ? "Adjust Crop" : "Select Image");
  return (
    <Button
      type="button"
      ref={ref}
      onClick={handleClick}
      disabled={isCropperUIVisible || disabled}
      {...props}
    >
      {buttonText}
    </Button>
  );
});
ImageCropTrigger.displayName = "ImageCropTrigger";

// --- ImageCrop.ContentArea ---
export type ImageCropContentAreaProps = React.HTMLAttributes<HTMLDivElement>;
export const ImageCropContentArea: React.FC<ImageCropContentAreaProps> = ({
  className,
  children,
  ...props
}) => {
  const { isCropperUIVisible } = useImageCrop();
  if (!isCropperUIVisible) return null;
  return (
    <div className={cn("bg-card", className)} {...props}>
      {children}
    </div>
  );
};

// --- ImageCrop.Header, Title, Description ---
export type ImageCropHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const ImageCropHeader: React.FC<ImageCropHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-between border-b p-4", className)}
    {...props}
  >
    {children}
  </div>
);
export type ImageCropTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export const ImageCropTitle: React.FC<ImageCropTitleProps> = ({
  className,
  children,
  ...props
}) => (
  <h2 className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </h2>
);
export type ImageCropDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;
export const ImageCropDescription: React.FC<ImageCropDescriptionProps> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-muted-foreground text-sm", className)} {...props}>
    {children}
  </p>
);

// --- ImageCrop.Cropper ---
export interface ImageCropCropperProps {
  className?: string;
}
export const ImageCropCropper: React.FC<ImageCropCropperProps> = ({
  className,
}) => {
  const {
    originalFileSrc,
    currentCrop,
    setCurrentCrop,
    updateLivePreview,
    aspectRatio,
    imgRef,
    error,
    setError,
  } = useImageCrop();
  const isCropAreaDefined =
    currentCrop && currentCrop.width > 0 && currentCrop.height > 0;
  if (!originalFileSrc)
    return (
      <div className="text-muted-foreground p-4 text-center">
        Loading image for crop...
      </div>
    );
  return (
    <div className="relative w-fit place-self-center rounded-md p-4">
      <ReactCrop
        style={{ display: "block" }}
        ruleOfThirds
        crop={currentCrop}
        onChange={setCurrentCrop}
        onComplete={updateLivePreview}
        aspect={aspectRatio}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt="Crop area"
          src={originalFileSrc}
          className={cn("block max-h-[60vh]", className)}
        />
      </ReactCrop>
      {!isCropAreaDefined && originalFileSrc && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-black/50 p-8 text-center text-sm text-white">
          Drag on image to select an area to crop
        </div>
      )}
      {error && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 rounded-md bg-black/50 text-red-600"
          role="alert"
        >
          {error}{" "}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
};

// --- ImageCrop.Footer ---
export type ImageCropFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const ImageCropFooter: React.FC<ImageCropFooterProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex flex-wrap justify-end gap-2 border-t p-4", className)}
    {...props}
  >
    {children}
  </div>
);

// --- ImageCrop.ApplyAction ---
export type ImageCropApplyActionProps = ButtonProps;
export const ImageCropApplyAction = React.forwardRef<
  HTMLButtonElement,
  ImageCropApplyActionProps
>(({ onClick, children, disabled, ...props }, ref) => {
  const { applyCropAndClose, isLoading, currentCrop } = useImageCrop();
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await applyCropAndClose();
    onClick?.(event);
  };
  const isButtonDisabled =
    (disabled ?? isLoading) ||
    !currentCrop ||
    currentCrop.width === 0 ||
    currentCrop.height === 0;
  return (
    <Button
      type="button"
      ref={ref}
      onClick={handleClick}
      disabled={isButtonDisabled}
      {...props}
    >
      {children ?? (isLoading ? "Applying..." : "Apply")}
    </Button>
  );
});
ImageCropApplyAction.displayName = "ImageCropApplyAction";

// --- ImageCrop.DeleteAction (Renamed) ---
export type ImageCropDeleteActionProps = ButtonProps;
export const ImageCropDeleteAction = React.forwardRef<
  HTMLButtonElement,
  ImageCropDeleteActionProps
>(({ onClick, children, ...props }, ref) => {
  const { clearImageAndClose, isLoading } = useImageCrop();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    clearImageAndClose();
    onClick?.(event);
  };
  return (
    <Button
      type="button"
      variant="destructive"
      ref={ref}
      onClick={handleClick}
      disabled={isLoading}
      {...props}
    >
      {children ?? "Delete"}
    </Button>
  );
});
ImageCropDeleteAction.displayName = "ImageCropDeleteAction";

// --- ImageCrop.ChangeAction ---
export type ImageCropChangeActionProps = ButtonProps;
export const ImageCropChangeAction = React.forwardRef<
  HTMLButtonElement,
  ImageCropChangeActionProps
>(({ onClick, children, ...props }, ref) => {
  const { triggerFileInput, isLoading } = useImageCrop();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    triggerFileInput();
    onClick?.(event);
  };
  return (
    <Button
      type="button"
      variant="outline"
      ref={ref}
      onClick={handleClick}
      disabled={isLoading}
      {...props}
    >
      {children ?? "Change File"}
    </Button>
  );
});
ImageCropChangeAction.displayName = "ImageCropChangeAction";

// --- ImageCrop.CloseAction (New) ---
export type ImageCropCloseActionProps = ButtonProps;
export const ImageCropCloseAction = React.forwardRef<
  HTMLButtonElement,
  ImageCropCloseActionProps
>(({ onClick, children, ...props }, ref) => {
  const { closeCropperUI, isLoading } = useImageCrop();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    closeCropperUI();
    onClick?.(event);
  };
  return (
    <Button
      type="button"
      variant="ghost"
      ref={ref}
      onClick={handleClick}
      disabled={isLoading}
      {...props}
    >
      {children ?? <XIcon className="h-5 w-5" />}
    </Button>
  );
});
ImageCropCloseAction.displayName = "ImageCropCloseAction";

// --- ImageCrop.Preview ---
export interface ImageCropPreviewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  imgClassName?: string;
  placeholder?: React.ReactNode;
  altText?: string;
}
export const ImageCropPreview: React.FC<ImageCropPreviewProps> = ({
  className,
  imgClassName,
  placeholder,
  altText = "Image preview",
  ...props
}) => {
  const { livePreviewBlobUrl, croppedBlobUrl, isPreviewLoading } =
    useImageCrop();
  const displayUrl = livePreviewBlobUrl ?? croppedBlobUrl;

  if (!displayUrl && !isPreviewLoading) {
    return (
      <div
        className={cn(
          "text-muted flex aspect-square h-auto w-48 items-center justify-center rounded-lg border bg-slate-100 dark:bg-slate-800",
          className,
        )}
        {...props}
      >
        {placeholder ?? <ImageIcon className="size-12 stroke-[1.5px]" />}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "text-muted relative flex aspect-square h-auto w-48 items-center justify-center overflow-hidden rounded-lg border bg-slate-100 dark:bg-slate-800",
        className,
      )}
      {...props}
    >
      {isPreviewLoading && !displayUrl && (
        <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
          Loading Preview...
        </div>
      )}
      {displayUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
          alt={altText}
          className={cn("h-full w-full object-contain", imgClassName)}
        />
      )}
      {!displayUrl && isPreviewLoading && placeholder}
    </div>
  );
};
