"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
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
import { Image as ImageIcon, X as XIcon, Loader2 } from "lucide-react";

// --- Types ---
export interface ImageCropRootProps {
  value?: Blob | string | null;
  onChange: (blobOrUrl: Blob | string | null) => void;
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

interface CommittedStateSnapshot {
  value: Blob | string | null;
  trueOriginalFile: File | null;
  initialDbUrl: string | null;
}

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
  const [snapshotBeforeNewSelection, setSnapshotBeforeNewSelection] =
    useState<CommittedStateSnapshot | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAppliedImage = useMemo(
    () => !!(initialDbUrl ?? (value instanceof Blob && croppedBlobUrl)),
    [initialDbUrl, value, croppedBlobUrl],
  );

  useEffect(() => {
    console.log(
      "EFFECT[value]: RHF value prop changed to:",
      value,
      "Current TOF:",
      trueOriginalFile?.name,
      "Current IDB:",
      initialDbUrl,
    );
    let newDisplayUrl: string | null = null;
    let newInitialDbUrlState: string | null = null;

    if (typeof value === "string" && value) {
      newDisplayUrl = value;
      newInitialDbUrlState = value;

      if (initialDbUrl !== value) {
        console.log(
          "EFFECT[value]: RHF value is a NEW DB URL. Clearing trueOriginalFile and originalFile.",
          value,
        );
        setTrueOriginalFile(null);
        setOriginalFile(null);
        setCurrentCrop(undefined);
        setLivePreviewBlob(null);
      } else {
        console.log(
          "EFFECT[value]: RHF value is DB URL, but same as current initialDbUrl. No change to TOF/originalFile.",
          value,
        );
      }
    } else if (value instanceof Blob) {
      console.log(
        "EFFECT[value]: RHF value is a Blob. Creating object URL for display.",
      );
      newDisplayUrl = URL.createObjectURL(value);
      newInitialDbUrlState = null;
      if (
        !initialDbUrl &&
        !trueOriginalFile &&
        !originalFile &&
        !isCropperUIVisible
      ) {
        let fileName = "initial-blob-as-tof.bin";
        if (value instanceof File) fileName = value.name;
        console.log(
          "EFFECT[value]: RHF value is Blob, NO other source context, setting trueOriginalFile:",
          fileName,
        );
        setTrueOriginalFile(new File([value], fileName, { type: value.type }));
      }
    } else {
      console.log("EFFECT[value]: RHF value is null/undefined.");
      newInitialDbUrlState = null;
      if (!snapshotBeforeNewSelection && !isCropperUIVisible) {
        console.log(
          "EFFECT[value]: RHF value is null, not reverting, not cropping; clearing trueOriginalFile and originalFile.",
        );
        setTrueOriginalFile(null);
        setOriginalFile(null);
        setCurrentCrop(undefined);
      } else {
        console.log(
          "EFFECT[value]: RHF value is null, but either reverting or cropper is active; TOF/originalFile not cleared here.",
        );
      }
    }

    if (
      croppedBlobUrl &&
      croppedBlobUrl !== newDisplayUrl &&
      !croppedBlobUrl.startsWith("http")
    ) {
      URL.revokeObjectURL(croppedBlobUrl);
    }
    setCroppedBlobUrl(newDisplayUrl);
    setInitialDbUrl(newInitialDbUrlState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
    isCropperUIVisible,
    originalFile,
    snapshotBeforeNewSelection,
    initialDbUrl,
    trueOriginalFile,
  ]);

  useEffect(() => {
    console.log(
      "EFFECT[originalFile]: originalFile changed to:",
      originalFile?.name,
    );
    let objectUrl: string | null = null;
    if (originalFile) {
      objectUrl = URL.createObjectURL(originalFile);
      console.log(
        "EFFECT[originalFile]: Creating new originalFileSrc:",
        objectUrl,
      );
      setOriginalFileSrc(objectUrl);
    } else {
      console.log(
        "EFFECT[originalFile]: originalFile is null, setting originalFileSrc to null",
      );
      setOriginalFileSrc(null);
    }
    return () => {
      if (objectUrl) {
        console.log(
          "EFFECT[originalFile] CLEANUP: Revoking originalFileSrc:",
          objectUrl,
        );
        URL.revokeObjectURL(objectUrl);
      }
    };
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
        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`,
          );
        }
        const blobData = await response.blob();
        const fileName =
          imageUrl.substring(imageUrl.lastIndexOf("/") + 1) ||
          "image_from_db.bin";
        const fileFromDb = new File([blobData], fileName, {
          type: blobData.type || "application/octet-stream",
        });
        console.log(
          "FETCH_IMAGE: Successfully fetched. Setting trueOriginalFile and originalFile:",
          fileFromDb.name,
        );
        setTrueOriginalFile(fileFromDb);
        setOriginalFile(fileFromDb);
        setCurrentCrop(undefined);
        setLivePreviewBlob(null);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "Could not load initial image.";
        console.error("Error fetching image for cropping:", e);
        setError(
          `Previous image unavailable: ${errorMessage} Please select a new image.`,
        );
        setTrueOriginalFile(null);
        setOriginalFile(null);
        setInitialDbUrl(null);
        setCurrentCrop(undefined);
        setLivePreviewBlob(null);
        onChange(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onChange],
  );

  useEffect(() => {
    console.log(
      "EFFECT[isCropperUIVisible]: changed to",
      isCropperUIVisible,
      "hasAppliedImage:",
      hasAppliedImage,
      "originalFile:",
      originalFile?.name,
      "trueOriginalFile:",
      trueOriginalFile?.name,
      "initialDbUrl:",
      initialDbUrl,
    );
    if (isCropperUIVisible && hasAppliedImage && !originalFile) {
      if (trueOriginalFile) {
        console.log(
          "EFFECT[isCropperUIVisible]: Opening for Adjust Crop with existing trueOriginalFile:",
          trueOriginalFile.name,
        );
        setOriginalFile(trueOriginalFile);
        setCurrentCrop(undefined);
        setLivePreviewBlob(null);
        setError(null);
      } else if (initialDbUrl) {
        console.log(
          "EFFECT[isCropperUIVisible]: Opening for Adjust Crop by fetching initialDbUrl:",
          initialDbUrl,
        );
        void fetchAndSetImageForCropping(initialDbUrl);
      } else {
        console.warn(
          "EFFECT[isCropperUIVisible]: 'Adjust Crop' but no trueOriginalFile or initialDbUrl. Value:",
          value,
        );

        if (value instanceof Blob && !trueOriginalFile) {
          let fileName = "adj-blob-as-tof.bin";
          if (value instanceof File) fileName = value.name;
          const tempTOF = new File([value], fileName, { type: value.type });
          console.log(
            "EFFECT[isCropperUIVisible]: Adjusting, TOF missing, recreating from RHF Blob value:",
            tempTOF.name,
          );
          setTrueOriginalFile(tempTOF);
          setOriginalFile(tempTOF);
          setCurrentCrop(undefined);
          setLivePreviewBlob(null);
          setError(null);
        } else {
          console.log(
            "EFFECT[isCropperUIVisible]: No source for Adjust Crop, user may need to Change File.",
          );
        }
      }
    } else if (!isCropperUIVisible && originalFile) {
      console.log(
        "EFFECT[isCropperUIVisible]: Cropper closing, clearing active originalFile:",
        originalFile.name,
      );
      setOriginalFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCropperUIVisible, hasAppliedImage, fetchAndSetImageForCropping, value]); //

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      console.log(
        "HANDLE_FILE_SELECT: Triggered. Current RHF value (value prop):",
        value,
        "Current TOF:",
        trueOriginalFile?.name,
      );
      setSnapshotBeforeNewSelection({
        value: value ?? null,
        trueOriginalFile: trueOriginalFile,
        initialDbUrl: initialDbUrl,
      });
      setError(null);
      setLivePreviewBlob(null);
      setCurrentCrop(undefined);

      const file = event.target.files?.[0];
      if (event.target.value) event.target.value = "";

      if (!file) {
        console.log("HANDLE_FILE_SELECT: No file selected.");
        return;
      }
      console.log("HANDLE_FILE_SELECT: File selected:", file.name);

      if (!acceptedMimeTypes.includes(file.type)) {
        setError(`Invalid type. Accepted: ${acceptedMimeTypes.join(", ")}`);
        return;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File too large. Max: ${maxFileSizeMB}MB`);
        return;
      }
      console.log(
        "HANDLE_FILE_SELECT: Setting trueOriginalFile and originalFile to new file:",
        file.name,
      );
      setTrueOriginalFile(file);
      setOriginalFile(file);

      if (
        croppedBlobUrl &&
        !initialDbUrl &&
        !croppedBlobUrl.startsWith("http")
      ) {
        URL.revokeObjectURL(croppedBlobUrl);
      }
      setCroppedBlobUrl(null);
      setInitialDbUrl(null);

      onChange(null);
      setIsCropperUIVisible(true);
    },
    [
      value,
      trueOriginalFile,
      initialDbUrl,
      onChange,
      acceptedMimeTypes,
      maxFileSizeMB,
      setIsCropperUIVisible,
      croppedBlobUrl,
    ],
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
        console.log(
          "APPLY_CROP: Applied. New blob created. Source (trueOriginalFile) remains:",
          trueOriginalFile?.name,
        );
        onChange(blob);
        setInitialDbUrl(null);
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
      setSnapshotBeforeNewSelection(null);
    }
  }, [
    originalFile,
    currentCrop,
    onChange,
    outputOptions,
    setIsCropperUIVisible,
    trueOriginalFile,
  ]);

  const clearImageAndClose = useCallback(() => {
    console.log("CLEAR_IMAGE_CLOSE: Clearing all image states.");
    setTrueOriginalFile(null);
    setInitialDbUrl(null);
    setCurrentCrop(undefined);
    setLivePreviewBlob(null);
    setError(null);
    setIsLoading(false);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsCropperUIVisible(false);
    setSnapshotBeforeNewSelection(null);
  }, [onChange, setIsCropperUIVisible]);

  const closeCropperUI = useCallback(() => {
    const uncommittedNewFileSession =
      value === null && snapshotBeforeNewSelection !== null;
    console.log(
      "CLOSE_UI: Triggered. uncommittedNewFileSession:",
      uncommittedNewFileSession,
      "Snapshot:",
      snapshotBeforeNewSelection,
    );

    setIsCropperUIVisible(false);
    setLivePreviewBlob(null);
    setCurrentCrop(undefined);
    setError(null);

    if (uncommittedNewFileSession && snapshotBeforeNewSelection) {
      console.log(
        "CLOSE_UI: Reverting an uncommitted new file selection. Calling onChange with snapshot value:",
        snapshotBeforeNewSelection.value,
      );
      onChange(snapshotBeforeNewSelection.value);

      console.log(
        "CLOSE_UI: Restoring trueOriginalFile to snapshot's TOF:",
        snapshotBeforeNewSelection.trueOriginalFile?.name,
      );
      setTrueOriginalFile(snapshotBeforeNewSelection.trueOriginalFile);
    }
    setSnapshotBeforeNewSelection(null);
  }, [setIsCropperUIVisible, value, onChange, snapshotBeforeNewSelection]);

  const triggerFileInput = useCallback(() => {
    console.log("TRIGGER_FILE_INPUT: Called");
    fileInputRef.current?.click();
  }, []);

  const contextValue: ImageCropContextType = useMemo(() => {
    console.log("CONTEXT_VALUE: Memoized context value recomputed.");
    return {
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
  }, [
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
    updateLivePreview,
    handleFileSelect,
    applyCropAndClose,
    clearImageAndClose,
    closeCropperUI,
    triggerFileInput,
    setCurrentCrop,
    setError,
    setIsCropperUIVisible,
  ]);

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
    isLoading,
  } = useImageCrop();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(
      "TRIGGER_CLICK: hasAppliedImage:",
      hasAppliedImage,
      "originalFileSrc:",
      !!originalFileSrc,
      "isCropperUIVisible:",
      isCropperUIVisible,
    );
    if (hasAppliedImage && !originalFileSrc && !isCropperUIVisible) {
      console.log("TRIGGER_CLICK: Opening for Adjust Crop");
      setIsCropperUIVisible(true);
    } else {
      console.log(
        "TRIGGER_CLICK: Triggering file input (for new selection or change within cropper)",
      );
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
      disabled={isCropperUIVisible || isLoading || disabled}
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
    triggerFileInput,
    isLoading,
  } = useImageCrop();
  console.log(
    "CROPPER_RENDER: originalFileSrc:",
    originalFileSrc,
    "Error:",
    error,
  );
  const isCropAreaDefined =
    currentCrop && currentCrop.width > 0 && currentCrop.height > 0;

  if (!originalFileSrc) {
    if (error) {
      return (
        <div className="text-destructive flex min-h-[200px] flex-col items-center justify-center gap-2 p-4 text-center">
          <XIcon className="text-destructive h-10 w-10" />
          <p className="font-semibold">Image Unavailable</p>
          <p className="max-w-xs text-sm">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              triggerFileInput();
            }}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Select New Image
          </Button>
        </div>
      );
    }
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center p-4 text-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        {isLoading ? "Loading image..." : "Waiting for image..."}
      </div>
    );
  }

  return (
    <div className="relative w-fit place-self-center rounded-md p-4">
      {error && !originalFileSrc && (
        <div className="bg-destructive/20 text-destructive absolute top-0 right-0 left-0 z-10 p-2 text-center text-xs">
          {error}
        </div>
      )}
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
>(({ onClick, children, disabled: propDisabled, ...props }, ref) => {
  const { applyCropAndClose, isLoading, currentCrop } = useImageCrop();
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await applyCropAndClose();
    onClick?.(event);
  };
  const isButtonDisabled =
    (propDisabled ?? isLoading) ||
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

// --- ImageCrop.DeleteAction ---
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

// --- ImageCrop.CloseAction ---
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
  const {
    livePreviewBlobUrl,
    croppedBlobUrl,
    isPreviewLoading: isLiveGenLoading,
  } = useImageCrop();
  const displayUrl = livePreviewBlobUrl ?? croppedBlobUrl;

  const [isRemoteImgLoading, setIsRemoteImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (
      displayUrl &&
      typeof displayUrl === "string" &&
      !displayUrl.startsWith("blob:")
    ) {
      console.log(
        "PREVIEW: Remote URL detected, setting loading true:",
        displayUrl,
      );
      setIsRemoteImgLoading(true);
      setImgError(false);
    } else {
      setIsRemoteImgLoading(false);
    }
  }, [displayUrl]);

  const handleImageLoad = () => {
    console.log("PREVIEW: Image loaded (onLoad):", displayUrl);
    setIsRemoteImgLoading(false);
    setImgError(false);
  };
  const handleImageError = () => {
    console.log("PREVIEW: Image failed to load (onError):", displayUrl);
    setIsRemoteImgLoading(false);
    setImgError(true);
  };

  const showOverallLoading = isLiveGenLoading || isRemoteImgLoading;

  if (imgError && !livePreviewBlobUrl) {
    return (
      <div
        className={cn(
          "text-destructive border-destructive/50 bg-destructive/10 flex aspect-square h-auto w-48 flex-col items-center justify-center rounded-lg border p-2 text-center text-xs",
          className,
        )}
        {...props}
      >
        <XIcon className="mb-1 size-8" /> Error loading image.
      </div>
    );
  }

  if (!displayUrl && !showOverallLoading) {
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
      {showOverallLoading && (
        <div className="bg-background/70 absolute inset-0 flex items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      )}
      {displayUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
          alt={altText}
          className={cn(
            "h-full w-full object-contain transition-opacity duration-300",
            isRemoteImgLoading &&
              displayUrl === croppedBlobUrl &&
              !livePreviewBlobUrl
              ? "opacity-0"
              : "opacity-100",
            imgClassName,
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};
