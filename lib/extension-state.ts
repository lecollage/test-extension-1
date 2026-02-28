export function readStoredCount(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

export function incrementCount(currentCount: number): number {
  return currentCount + 1;
}

export function badgeTextForCount(count: number): string {
  return count > 0 ? String(count) : "";
}
