import type { ProductPrice } from "../types/product";

export const getProductPriceAmount = (price: ProductPrice | undefined, kind: "fes" | "testShoot") => {
  const value = typeof price === "object" && price !== null
    ? price[kind]
    : kind === "fes"
      ? price
      : null;

  if (value == null || value === "") return null;

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
};

export const formatProductPrice = (amount: number | null) =>
  amount === null ? "Chưa có giá" : `${amount.toLocaleString("vi-VN")}đ`;
