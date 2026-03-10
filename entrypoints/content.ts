import { browser } from "wxt/browser";

import {
  detectProductPageFromText,
  type ProductDetectionResult,
} from "../lib/page-detection";
import type { ExtensionMessage, ProductPageData } from "../lib/messages";

const PROMPT_ID = "shopping-research-helper-prompt";
const CURRENCY_TOKENS = ["$", "USD", "EUR", "GBP", "PLN", "z\u0142"];

function safeText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function extractPriceText(bodyText: string): string {
  const text = bodyText.replace(/\s+/g, " ").trim();
  if (!text) {
    return "";
  }

  const firstMatchToken = CURRENCY_TOKENS.find((token) => text.includes(token));
  if (!firstMatchToken) {
    return "";
  }

  const index = text.indexOf(firstMatchToken);
  const start = Math.max(0, index - 8);
  const end = Math.min(text.length, index + 16);
  return text.slice(start, end).trim();
}

function findImageUrl(): string {
  const metaImage = document.querySelector<HTMLMetaElement>(
    'meta[property="og:image"]',
  );
  if (metaImage?.content) {
    return metaImage.content;
  }

  const image = document.querySelector<HTMLImageElement>("img");
  return image?.src ?? "";
}

function detectProductPage(): ProductDetectionResult {
  const headingText = safeText(document.querySelector("h1")?.textContent);
  const bodyText = safeText(document.body.textContent);
  const buttonTexts = Array.from(
    document.querySelectorAll("button, [role='button'], a"),
  )
    .map((element) => safeText(element.textContent))
    .filter((text) => text.length > 0)
    .slice(0, 40);

  return detectProductPageFromText({ headingText, bodyText, buttonTexts });
}

function collectProductData(): ProductPageData {
  const headingText = safeText(document.querySelector("h1")?.textContent);
  const fallbackTitle = safeText(document.title);
  const detection = detectProductPage();

  return {
    title: headingText || fallbackTitle || "Untitled Product",
    price: extractPriceText(safeText(document.body.textContent)),
    url: window.location.href,
    image: findImageUrl(),
    isProductPage: detection.isProductPage,
    score: detection.score,
  };
}

function hidePrompt(): void {
  document.getElementById(PROMPT_ID)?.remove();
}

function showPrompt(product: ProductPageData): void {
  if (document.getElementById(PROMPT_ID) || !product.isProductPage) {
    return;
  }

  const wrapper = document.createElement("section");
  wrapper.id = PROMPT_ID;
  wrapper.setAttribute("role", "dialog");
  wrapper.style.position = "fixed";
  wrapper.style.bottom = "16px";
  wrapper.style.right = "16px";
  wrapper.style.zIndex = "2147483647";
  wrapper.style.maxWidth = "340px";
  wrapper.style.border = "1px solid #d4e3dc";
  wrapper.style.borderRadius = "12px";
  wrapper.style.padding = "12px";
  wrapper.style.background = "#ffffff";
  wrapper.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
  wrapper.style.fontFamily =
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  const title = document.createElement("p");
  title.textContent = "Add this product to research?";
  title.style.margin = "0 0 8px";
  title.style.fontWeight = "600";

  const subtitle = document.createElement("p");
  subtitle.textContent = product.title;
  subtitle.style.margin = "0 0 10px";
  subtitle.style.fontSize = "13px";
  subtitle.style.color = "#334155";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";

  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.style.border = "0";
  addButton.style.background = "#0f3d33";
  addButton.style.color = "#fff";
  addButton.style.padding = "6px 10px";
  addButton.style.borderRadius = "8px";
  addButton.style.cursor = "pointer";

  const dismissButton = document.createElement("button");
  dismissButton.textContent = "Dismiss";
  dismissButton.style.border = "1px solid #cbd5e1";
  dismissButton.style.background = "#fff";
  dismissButton.style.color = "#334155";
  dismissButton.style.padding = "6px 10px";
  dismissButton.style.borderRadius = "8px";
  dismissButton.style.cursor = "pointer";

  addButton.addEventListener("click", () => {
    const message: ExtensionMessage = {
      type: "save-detected-product",
      data: product,
    };

    browser.runtime.sendMessage(message).then(() => {
      hidePrompt();
    });
  });
  dismissButton.addEventListener("click", hidePrompt);

  actions.append(addButton, dismissButton);
  wrapper.append(title, subtitle, actions);
  document.body.append(wrapper);
}

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  main() {
    browser.runtime.onMessage.addListener((message: ExtensionMessage) => {
      if (message.type !== "extract-product") {
        return undefined;
      }

      return Promise.resolve(collectProductData());
    });

    const product = collectProductData();
    showPrompt(product);
  },
});
