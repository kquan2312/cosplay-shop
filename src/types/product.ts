export interface ProductImage {
  id?: string;
  productId?: string;
  url: string;
  isThumbnail: boolean;
}

export interface ProductPrices {
  fes?: string | number | null;
  testShoot?: string | number | null;
}

export type ProductPrice = string | number | ProductPrices | null;

export interface Product {
  id: string;
  name: string;
  type: "COS" | "WIG" | "MAKE" | string;
  ver?: string | null;
  price?: ProductPrice;
  size?: string | null;
  note?: string | null;
  images?: ProductImage[];
}