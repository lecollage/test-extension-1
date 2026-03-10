import { describe, expect, it } from "vitest";

import { detectProductPageFromText } from "./page-detection";

describe("product page detection", () => {
  it("detects product page when at least two signals are present", () => {
    const result = detectProductPageFromText({
      headingText: "Ergotron LX",
      bodyText: "Great monitor arm for $59 with smooth movement",
      buttonTexts: ["Add to cart"],
    });

    expect(result.score).toBe(3);
    expect(result.isProductPage).toBe(true);
  });

  it("returns non-product when fewer than two signals are present", () => {
    const result = detectProductPageFromText({
      headingText: "",
      bodyText: "Welcome to our blog post",
      buttonTexts: ["Read more"],
    });

    expect(result.score).toBe(0);
    expect(result.isProductPage).toBe(false);
  });
});
