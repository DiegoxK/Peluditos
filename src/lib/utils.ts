import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { format } from "date-fns";
import { es } from "date-fns/locale";

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
