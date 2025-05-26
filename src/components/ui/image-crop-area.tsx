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
import { Image } from "lucide-react";

// --- Types ---
export interface ImageCropRootProps {
  value?: Blob | null;
  onChange: (blob: Blob | null) => void;
  children: ReactNode;
  aspectRatio?: number;
  maxFileSizeMB?: number;
  acceptedMimeTypes?: string[];
  outputOptions?: CropImageOptions;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export interface ImageCropContextType {
  // State
  originalFileSrc: string | null; // Current image in cropper
  croppedBlobUrl: string | null; // Final applied RHF value preview
  livePreviewBlobUrl: string | null; // Instant preview during crop adjustment
  isPreviewLoading: boolean; // Loading state for live preview
  currentCrop?: Crop;
  isCropperUIVisible: boolean; // Renamed from isOpen for clarity (UI visibility)
  isLoading: boolean; // For applyCrop main action
  error: string | null;
  aspectRatio?: number;
  acceptedMimeTypes?: string[];
  hasAppliedImage: boolean; // True if RHF value (croppedBlobUrl) exists

  // Refs
  imgRef: RefObject<HTMLImageElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;

  // Actions
  setCurrentCrop: Dispatch<SetStateAction<Crop | undefined>>;
  updateLivePreview: (completedCrop: Crop) => Promise<void>;
  handleFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  applyCropAndClose: () => Promise<void>;
  clearImageAndClose: () => void;
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

// aspectRatio={16 / 9} // (landscape)
// aspectRatio={1 / 1} // (square)
// aspectRatio={3 / 4} // (portrait)
export const ImageCropRoot: React.FC<ImageCropRootProps> = ({
  children,
  value,
  onChange,
  aspectRatio,
  maxFileSizeMB = 4,
  acceptedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  outputOptions = { outputType: "image/webp", outputQuality: 0.8 },
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isCropperUIVisible = controlledOpen ?? internalOpen;
  const setIsCropperUIVisible = useCallback(
    (newOpenState: SetStateAction<boolean>) => {
      const finalNewState =
        typeof newOpenState === "function"
          ? newOpenState(isCropperUIVisible)
          : newOpenState;
      if (controlledOnOpenChange) {
        controlledOnOpenChange(finalNewState);
      } else {
        setInternalOpen(finalNewState);
      }
    },
    [controlledOnOpenChange, isCropperUIVisible],
  );

  const [trueOriginalFile, setTrueOriginalFile] = useState<File | null>(null); // The very first selected file
  const [originalFile, setOriginalFile] = useState<File | null>(null); // File currently in cropper
  const [originalFileSrc, setOriginalFileSrc] = useState<string | null>(null);

  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null); // RHF value
  const [croppedBlobUrl, setCroppedBlobUrl] = useState<string | null>(null);

  const [livePreviewBlob, setLivePreviewBlob] = useState<Blob | null>(null); // For instant preview
  const [livePreviewBlobUrl, setLivePreviewBlobUrl] = useState<string | null>(
    null,
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [currentCrop, setCurrentCrop] = useState<Crop | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false); // For main apply action
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAppliedImage = !!croppedBlobUrl; // Based on final RHF value's preview

  // Effect for RHF value sync
  useEffect(() => {
    if (value && value !== croppedBlob) setCroppedBlob(value);
    else if (value === null && croppedBlob !== null) setCroppedBlob(null);
  }, [value, croppedBlob]);

  // Effect for final croppedBlobUrl (RHF value preview)
  useEffect(() => {
    if (!croppedBlob) {
      if (croppedBlobUrl) URL.revokeObjectURL(croppedBlobUrl);
      setCroppedBlobUrl(null);
      return;
    }
    const newUrl = URL.createObjectURL(croppedBlob);
    setCroppedBlobUrl(newUrl);
    return () => URL.revokeObjectURL(newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedBlob]);

  // Effect for originalFileSrc (image in cropper)
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

  // Effect for livePreviewBlobUrl
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

  // Effect to load trueOriginalFile into cropper when UI opens for "Adjust Crop"
  useEffect(() => {
    if (
      isCropperUIVisible &&
      trueOriginalFile &&
      !originalFile &&
      hasAppliedImage
    ) {
      // Opening to re-crop an existing applied image using its true original
      setOriginalFile(trueOriginalFile); // Load true original into cropper
      setCurrentCrop(undefined); // Start with no selection
      setLivePreviewBlob(null); // Clear any old live preview
      setError(null);
    } else if (
      !isCropperUIVisible &&
      originalFile === trueOriginalFile &&
      hasAppliedImage
    ) {
      // If UI was closed (e.g. by Cancel) while re-cropping the trueOriginalFile
      setOriginalFile(null); // Clear the cropper's active image, so next "Select Image" is fresh
    }
  }, [isCropperUIVisible, trueOriginalFile, originalFile, hasAppliedImage]);

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

      setTrueOriginalFile(file); // Store as the new "true original"
      setOriginalFile(file); // Load into cropper
      setCroppedBlob(null); // Clear any previously applied RHF value
      onChange(null);
      setCurrentCrop(undefined); // No initial crop area
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
        setLivePreviewBlob(null); // Clear preview if crop is invalid
        return;
      }
      setIsPreviewLoading(true);
      try {
        // Use a slightly lower quality for faster preview if desired
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
        setCroppedBlob(blob);
        onChange(blob);
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
    setCroppedBlob(null);
    setCurrentCrop(undefined);
    setLivePreviewBlob(null);
    setError(null);
    setIsLoading(false);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsCropperUIVisible(false);
  }, [onChange, setIsCropperUIVisible]);

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
    if (hasAppliedImage && !originalFileSrc) {
      // Has an applied image, but cropper is not showing it
      setIsCropperUIVisible(true); // This will trigger the useEffect in Root to load trueOriginal
    } else {
      triggerFileInput(); // For selecting a new file or re-selecting if cropper already shows original
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
      disabled={isCropperUIVisible || disabled} // Disable if cropper UI is open
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
    <div className={className} {...props}>
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
  <div className={className} {...props}>
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
      <div className="text-muted-foreground p-4 text-center">Loading...</div>
    );

  return (
    <div className="relative w-fit place-self-center rounded-md">
      <ReactCrop
        style={{
          display: "block",
        }}
        ruleOfThirds
        crop={currentCrop}
        onChange={setCurrentCrop} // Updates currentCrop continuously
        onComplete={updateLivePreview} // Updates live preview on drag/resize end
        aspect={aspectRatio}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt="Crop area"
          src={originalFileSrc}
          className={className}
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
          {error}
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

// --- ImageCrop.Footer (unchanged, simple wrapper) ---
export type ImageCropFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const ImageCropFooter: React.FC<ImageCropFooterProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex flex-wrap justify-end gap-2", className)} {...props}>
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
    (currentCrop && currentCrop.width === 0) ||
    (currentCrop && currentCrop.height === 0);

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

// --- ImageCrop.CancelAction ---
export type ImageCropCancelActionProps = ButtonProps;
export const ImageCropCancelAction = React.forwardRef<
  HTMLButtonElement,
  ImageCropCancelActionProps
>(({ onClick, children, ...props }, ref) => {
  const { clearImageAndClose, isLoading } = useImageCrop();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    clearImageAndClose();
    onClick?.(event);
  };
  return (
    <Button
      type="button"
      ref={ref}
      onClick={handleClick}
      disabled={isLoading}
      className="bg-red-500 hover:bg-red-400"
      {...props}
    >
      {children ?? "Cancel"}
    </Button>
  );
});
ImageCropCancelAction.displayName = "ImageCropCancelAction";

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
      // variant="outline"
      ref={ref}
      onClick={handleClick}
      disabled={isLoading}
      className="bg-indigo-500 hover:bg-indigo-400"
      {...props}
    >
      {children ?? "Change File"}
    </Button>
  );
});
ImageCropChangeAction.displayName = "ImageCropChangeAction";

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
    // Show placeholder if no URL and not loading a preview
    return (
      <div
        className={cn(
          "text-muted flex aspect-[1/1] h-auto w-[200px] items-center justify-center rounded-lg border bg-slate-100 dark:bg-slate-800",
          className,
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        {placeholder ?? <Image className="size-12" strokeWidth={1.5} />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "text-muted flex aspect-[1/1] h-auto w-[200px] items-center justify-center overflow-hidden rounded-lg border bg-slate-100 dark:bg-slate-800",
        className,
      )}
      {...props}
    >
      {isPreviewLoading &&
        !livePreviewBlobUrl &&
        !croppedBlobUrl && ( // Show loader only if no image is currently displayed
          <div className="bg-background/50 flex items-center justify-center">
            Loading...
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
