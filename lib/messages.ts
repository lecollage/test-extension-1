export interface ProductPageData {
  title: string;
  price: string;
  url: string;
  image: string;
  isProductPage: boolean;
  score: number;
}

export interface ExtractProductMessage {
  type: "extract-product";
}

export interface SaveDetectedProductMessage {
  type: "save-detected-product";
  data: ProductPageData;
}

export type ExtensionMessage =
  | ExtractProductMessage
  | SaveDetectedProductMessage;
