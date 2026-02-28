import { describe, expect, it } from "vitest";

import {
  formatCountValue,
  formatPopupTime,
  formatPopupTimeForLocale,
  getNextOpenCount,
  shouldCloseModalForKey,
} from "./popup";

describe("popup helpers", () => {
  it("formats popup time using the shared formatter", () => {
    const date = new Date("2026-02-28T15:04:05.000Z");

    expect(formatPopupTime(date)).toBeTypeOf("string");
  });

  it("formats popup time deterministically when locale options are provided", () => {
    const date = new Date("2026-02-28T15:04:05.000Z");

    expect(
      formatPopupTimeForLocale(date, "en-GB", {
        timeZone: "UTC",
        hour12: false,
      }),
    ).toBe("15:04:05");
  });

  it("increments stored counts and defaults invalid values to zero", () => {
    expect(getNextOpenCount(3)).toBe(4);
    expect(getNextOpenCount(undefined)).toBe(1);
  });

  it("formats the visible counter value", () => {
    expect(formatCountValue(12)).toBe("12");
  });

  it("only closes the modal for the Escape key", () => {
    expect(shouldCloseModalForKey("Escape")).toBe(true);
    expect(shouldCloseModalForKey("Enter")).toBe(false);
  });
});
