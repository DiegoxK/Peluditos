export interface Filters {
  species?: "perro" | "gato";
  ageRanges?: ("cachorro" | "joven" | "adulto" | "senior")[];
  sizes?: ("pequeno" | "mediano" | "grande")[];
  gender?: "macho" | "hembra";
  sortBy?: "newest" | "ageAsc" | "ageDesc";
}

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 9;
export const DEFAULT_FILTERS = {} as Filters;
