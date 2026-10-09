import { useEffect, useState } from "react";
import { defaultShopSettings, getSiteSettings } from "../../config/siteSettings";

interface HeaderProps {
 searchQuery: string;
 onSearch: (value: string) => void;
}

const Header = ({ searchQuery, onSearch }: HeaderProps) => {
 const [input, setInput] = useState(searchQuery);
 const [settings, setSettings] = useState(defaultShopSettings);

 useEffect(() => {
   setInput(searchQuery);
 }, [searchQuery]);

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

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   onSearch(input);
 };

 return (
   <header className="sticky top-0 z-50 border-b border-[#F2D7FF] bg-white/90 backdrop-blur-sm">
     <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:h-24 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-8">
       <div className="flex items-center justify-between gap-3 lg:min-w-0 lg:flex-1">
         <div className="flex min-w-0 items-center gap-3">
           {settings.logo ? (
             <img src={settings.logo} alt={settings.siteName} className="h-10 w-10 rounded-full object-cover ring-2 ring-[#F2D7FF] sm:h-12 sm:w-12" />
           ) : (
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C572DE] text-base font-bold text-white sm:h-12 sm:w-12 sm:text-xl">
               M
             </div>
           )}

           <div className="min-w-0">
             <h2 className="truncate text-base font-extrabold tracking-wide text-[#C572DE] sm:text-xl">
               {settings.siteName}
             </h2>
             <p className="truncate text-[10px] text-gray-500 sm:text-xs">{settings.slogan}</p>
           </div>
         </div>

         <a
           href="https://m.me/61590804933443?text=Yc%20t%E1%BB%AB%20page..."
           target="_blank"
           rel="noopener noreferrer"
           className="rounded-full bg-[#C572DE] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#B363D8] sm:px-5 sm:py-2.5 sm:text-sm lg:px-7 lg:py-3"
         >
           Chat FB
         </a>
       </div>

       <nav className="hidden items-center gap-6 text-[13px] font-medium lg:flex lg:gap-8 xl:gap-10 xl:text-[15px]">
         <a className="text-[#C572DE]" href="#">Home</a>
         <a className="transition hover:text-[#C572DE]" href="#costume">Costume</a>
         <a className="transition hover:text-[#C572DE]" href="#wig">Wig</a>
         <a className="transition hover:text-[#C572DE]" href="#makeup">Makeup</a>
         <a className="transition hover:text-[#C572DE]" href="#">Gallery</a>
       </nav>

       <form onSubmit={handleSubmit} className="w-full lg:ml-auto lg:flex lg:w-auto lg:max-w-md lg:flex-1 lg:justify-end">
         <div className="flex w-full overflow-hidden rounded-full border border-[#E9C8F9] bg-white shadow-sm lg:max-w-md">
           <input
             type="text"
             value={input}
             onChange={(event) => setInput(event.target.value)}
             placeholder="Tìm kiếm"
             className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 sm:px-4 sm:py-3"
           />
           <button
             type="submit"
             className="whitespace-nowrap bg-[#C572DE] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#B363D8] sm:px-5 sm:text-sm"
           >
             Tìm kiếm
           </button>
         </div>
       </form>
     </div>
   </header>
 );
};

export default Header;