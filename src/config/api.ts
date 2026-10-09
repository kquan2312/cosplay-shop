// Prefer relative paths with Vite proxy in dev so the browser sees same-origin requests.
// If you explicitly set VITE_API_BASE_URL, we use that instead.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const extractProductsList = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data;
  }

  return [];
};

export const extractPagination = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;

  const pagination = (payload as { pagination?: unknown }).pagination;
  if (pagination && typeof pagination === "object") {
    return pagination as Record<string, unknown>;
  }

  return null;
};

export const API = {
  products: `${API_BASE_URL}/products`,
  productsPage: (page = 1, limit = 12) => `${API_BASE_URL}/products?page=${page}&limit=${limit}`,
  productImages: `${API_BASE_URL}/product-images`,
  productById: (id: string) => `${API_BASE_URL}/products/${id}`,
  siteSetting: `${API_BASE_URL}/site-setting`,
  siteSettingById: (id: string) => `${API_BASE_URL}/site-setting/${id}`,
  productsByType: (type: string, search?: string, page = 1, limit = 12) => {
    const params = new URLSearchParams({
      type,
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
    });

    return `${API_BASE_URL}/products?${params.toString()}`;
  },
};

export default API;