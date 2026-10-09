import { useEffect, useState } from "react";
import { defaultShopSettings, getSiteSettings } from "../../config/siteSettings";

const Footer = () => {
  const [settings, setSettings] = useState(defaultShopSettings);

  useEffect(() => {
    const syncSettings = async () => {
      const nextSettings = await getSiteSettings();
      setSettings(nextSettings);
    };

    syncSettings();
    window.addEventListener("shop-settings-updated", syncSettings);

    return () => {
      window.removeEventListener("shop-settings-updated", syncSettings);
    };
  }, []);

  return (
    <footer className="mt-20 bg-[#120914] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.siteName} className="h-12 w-12 rounded-full object-cover ring-2 ring-[#C572DE]/40" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C572DE] text-lg font-bold text-white">
                M
              </div>
            )}

            <h2 className="text-2xl font-bold">
              {settings.siteName.split(" ").slice(0, -1).join(" ") || settings.siteName}
              {settings.siteName.includes(" ") && (
                <span className="text-[#C572DE]"> {settings.siteName.split(" ").slice(-1).join(" ")}</span>
              )}
            </h2>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-400">{settings.slogan}</p>
          <p className="mt-2 text-sm text-gray-400">{settings.address}</p>
          {settings.tel && <p className="mt-2 text-sm text-gray-400">{settings.tel}</p>}
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Category</h3>

          <ul className="space-y-3 text-gray-400">
            <li className="cursor-pointer hover:text-[#C572DE]">Cosplay</li>
            <li className="cursor-pointer hover:text-[#C572DE]">Wig</li>
            <li className="cursor-pointer hover:text-[#C572DE]">Makeup</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Support</h3>

          <ul className="space-y-3 text-gray-400">
            <li>Contact</li>
            <li>Shipping</li>
            <li>Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>

          <div className="flex gap-4">
            {["F", "I", "D"].map((item) => (
              <button
                key={item}
                className="h-10 w-10 rounded-full bg-white/10 transition hover:bg-[#C572DE]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
        © 2026 Meowiie Rental. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;