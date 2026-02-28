import { incrementCount, readStoredCount } from "./extension-state";
import { formatClockTime } from "./time";

export function formatPopupTime(date: Date): string {
  return formatClockTime(date);
}

export function formatPopupTimeForLocale(
  date: Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  return formatClockTime(date, locales, options);
}

export function getNextOpenCount(storedValue: unknown): number {
  return incrementCount(readStoredCount(storedValue));
}

export function formatCountValue(count: number): string {
  return String(count);
}

export function shouldCloseModalForKey(key: string): boolean {
  return key === "Escape";
}
