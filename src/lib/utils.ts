import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import * as XLSX from "xlsx";

import { type Crop } from "react-image-crop";

export interface CropImageOptions {
  outputType?: `image/${"png" | "jpeg" | "webp"}`;
  outputQuality?: number; // For 'image/jpeg' or 'image/webp' (0 to 1)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return format(date, "dd/MM/yyyy", { locale: es });
  } catch (error) {
    return dateStr;
  }
};

/**
 * Exports an array of objects to an Excel file.
 * @param data - Array of objects to export
 * @param filename - Desired filename (default: "export.xlsx")
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename = "export.xlsx",
): void {
  if (data.length === 0) {
    console.warn("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);
}

/**
 * Crops an image using OffscreenCanvas.
 * @param imgRef Ref to the HTMLImageElement.
 * @param crop The crop parameters from react-image-crop.
 * @param options Optional output type and quality.
 * @returns A Promise resolving to a Blob of the cropped image, or undefined if cropping failed.
 */
export const cropImage = async (
  imageElement: HTMLImageElement,
  crop: Crop,
  options?: CropImageOptions,
): Promise<Blob | undefined> => {
  const image = imageElement;

  // Ensure crop dimensions are valid numbers and not zero
  if (
    !crop ||
    typeof crop.width !== "number" ||
    typeof crop.height !== "number" ||
    typeof crop.x !== "number" ||
    typeof crop.y !== "number" ||
    crop.width === 0 ||
    crop.height === 0
  ) {
    console.warn("Invalid crop dimensions provided, cannot crop.", crop);
    return undefined; // No valid crop to make
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const targetWidth = Math.round(crop.width * scaleX);
  const targetHeight = Math.round(crop.height * scaleY);

  if (targetWidth === 0 || targetHeight === 0) {
    console.warn("Calculated target crop dimensions are zero after scaling.");
    return undefined;
  }

  try {
    const offscreenCanvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = offscreenCanvas.getContext("2d");

    if (!ctx) {
      console.error(
        "Failed to get 2D context from OffscreenCanvas for cropping.",
      );
      return undefined;
    }

    // Optional: Improve image quality for scaling operations, check browser support if used.
    // ctx.imageSmoothingEnabled = true; // Default is true for OffscreenCanvas
    // ctx.imageSmoothingQuality = "high"; // "high" is a common value

    ctx.drawImage(
      image,
      Math.round(crop.x * scaleX), // Source x
      Math.round(crop.y * scaleY), // Source y
      targetWidth, // Source width (cropped area on original image)
      targetHeight, // Source height (cropped area on original image)
      0, // Destination x on canvas
      0, // Destination y on canvas
      targetWidth, // Destination width on canvas
      targetHeight, // Destination height on canvas
    );

    const blobOptions: { type?: string; quality?: number } = {};
    if (options?.outputType) {
      blobOptions.type = options.outputType;
    }
    if (
      options?.outputQuality !== undefined &&
      (options.outputType === "image/jpeg" ||
        options.outputType === "image/webp")
    ) {
      blobOptions.quality = options.outputQuality;
    }

    return await offscreenCanvas.convertToBlob(blobOptions);
  } catch (error) {
    console.error("Error during image cropping with OffscreenCanvas:", error);
    return undefined;
  }
};
