export interface ProductSignals {
  titleDetected: boolean;
  priceDetected: boolean;
  buyButtonDetected: boolean;
}

export interface ProductDetectionResult {
  signals: ProductSignals;
  score: number;
  isProductPage: boolean;
}

const CURRENCY_TOKENS = ["usd", "eur", "gbp", "pln", "zl", "z\u0142", "$"];

const BUY_TERMS = [
  "add to cart",
  "buy now",
  "add to basket",
  "kup teraz",
  "dodaj do koszyka",
];

export function detectProductPageFromText(params: {
  headingText: string;
  bodyText: string;
  buttonTexts: string[];
}): ProductDetectionResult {
  const headingText = params.headingText.trim();
  const bodyText = params.bodyText.toLowerCase();
  const buttons = params.buttonTexts.join(" ").toLowerCase();

  const signals: ProductSignals = {
    titleDetected: headingText.length > 0,
    priceDetected: CURRENCY_TOKENS.some((token) => bodyText.includes(token)),
    buyButtonDetected: BUY_TERMS.some((term) => buttons.includes(term)),
  };

  const score =
    Number(signals.titleDetected) +
    Number(signals.priceDetected) +
    Number(signals.buyButtonDetected);

  return {
    signals,
    score,
    isProductPage: score >= 2,
  };
}
