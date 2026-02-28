type TimeFormatOptions = Intl.DateTimeFormatOptions;

const defaultTimeFormat: TimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

export function formatClockTime(
  date: Date,
  locales?: string | string[],
  options?: TimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locales, {
    ...defaultTimeFormat,
    ...options,
  }).format(date);
}
