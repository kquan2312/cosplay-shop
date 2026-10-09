import { API } from "./api";

export type ShopSettings = {
  id?: string;
  siteName: string;
  slogan: string;
  address: string;
  tel: string;
  logo: string;
};

export const defaultShopSettings: ShopSettings = {
  siteName: "Meowiie Rental",
  slogan: "Kawaii Studio",
  address: "Hà Nội, Việt Nam",
  tel: "0123456789",
  logo: "",
};

export const normalizeSiteSettings = (payload?: Partial<ShopSettings> & { shopName?: string }): ShopSettings => {
  const normalized = payload ?? {};

  return {
    ...defaultShopSettings,
    ...normalized,
    siteName: normalized.siteName ?? normalized.shopName ?? defaultShopSettings.siteName,
  };
};

export const getSiteSettings = async (): Promise<ShopSettings> => {
  try {
    const res = await fetch(API.siteSetting);
    if (!res.ok) {
      throw new Error(`Failed to load site settings: ${res.status}`);
    }

    const data = await res.json();
    return normalizeSiteSettings(data as Partial<ShopSettings>);
  } catch {
    return defaultShopSettings;
  }
};

export const saveSiteSettings = async (nextValues: Partial<ShopSettings>) => {
  const payload = normalizeSiteSettings(nextValues);
  const existingSettings = await getSiteSettings();
  const siteId = existingSettings.id ?? payload.id;

  const requestUrl = siteId ? API.siteSettingById(siteId) : API.siteSetting;
  const requestMethod = siteId ? "PUT" : "POST";

  const res = await fetch(requestUrl, {
    method: requestMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: siteId,
      siteName: payload.siteName,
      slogan: payload.slogan,
      address: payload.address,
      tel: payload.tel,
      logo: payload.logo,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Update failed: ${res.status}`);
  }

  const data = await res.json().catch(() => payload);
  const saved = normalizeSiteSettings(data as Partial<ShopSettings>);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("shop-settings-updated"));
  }

  return saved;
};
