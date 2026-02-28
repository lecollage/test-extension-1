import { readStoredCount } from "./extension-state";

export function getStoredCounterValue(value: unknown): number {
  return readStoredCount(value);
}

export function getChangedCounterValue(
  changes: Record<string, { newValue?: unknown }>,
  areaName: string,
  key: string,
): number | null {
  if (areaName !== "local" || !changes[key]) {
    return null;
  }

  const nextValue = changes[key].newValue;
  return typeof nextValue === "number" ? nextValue : null;
}
