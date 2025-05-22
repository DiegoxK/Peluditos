import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import * as XLSX from "xlsx";

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
