import { describe, expect, it } from "vitest";

import { formatClockTime } from "./time";

describe("time helpers", () => {
  it("formats a date using the provided locale and timezone", () => {
    const date = new Date("2026-02-28T15:04:05.000Z");

    expect(
      formatClockTime(date, "en-GB", {
        timeZone: "UTC",
        hour12: false,
      }),
    ).toBe("15:04:05");
  });

  it("allows overriding the default formatter options", () => {
    const date = new Date("2026-02-28T15:04:05.000Z");

    expect(
      formatClockTime(date, "en-US", {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        second: undefined,
      }),
    ).toBe("3:04 PM");
  });
});
