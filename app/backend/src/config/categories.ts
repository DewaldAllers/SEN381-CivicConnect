/**
 * Approved request categories and field limits (FR-002, FR-001).
 *
 * The real list and limits are still open as P-01. These values match the
 * stand-in server used to build the client, so the pages work unchanged.
 * When P-01 is decided, this file is the only place to edit.
 */
export interface Category {
  id: string;
  name: string;
}

export const APPROVED_CATEGORIES: readonly Category[] = [
  { id: "c-facilities", name: "Facilities" },
  { id: "c-it", name: "IT support" },
  { id: "c-security", name: "Security" },
  { id: "c-maintenance", name: "Maintenance" },
  { id: "c-lost", name: "Lost property" },
  { id: "c-other", name: "Other" },
];

export const FIELD_LIMITS = {
  titleMin: 5,
  titleMax: 100,
  descriptionMin: 10,
  descriptionMax: 1000,
  /** Engineering safeguard, not a baselined requirement: stops unbounded note storage. */
  noteMax: 2000,
} as const;

export function findCategory(id: string): Category | undefined {
  return APPROVED_CATEGORIES.find((category) => category.id === id);
}
