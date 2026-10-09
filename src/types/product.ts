export interface ProductImage {
  id?: string;
  productId?: string;
  url: string;
  isThumbnail: boolean;
}

export interface Product {
  id: string;
  name: string;
  type: "COS" | "WIG" | "MAKEUP" | string;
  ver?: string | null;
  price?: string | number | null;
  size?: string | null;
  note?: string | null;
  images?: ProductImage[];
}