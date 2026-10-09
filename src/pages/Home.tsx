import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

import Header from "../components/layout/Header";
import Hero from "../components/sections/Hero";
import Footer from "../components/layout/Footer";
import Statistics from "../components/sections/Statistics";
import ProductSection from "../components/sections/ProductSection";
import { API, extractPagination, extractProductsList } from "../config/api";
import type { Product } from "../types/product";

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
} as const;

const floatingItems = [
  {
    icon: "✿",
    left: "7%",
    top: "22%",
    duration: 4.5,
    delay: 0,
    size: "text-xl",
  },
  {
    icon: "♡",
    left: "90%",
    top: "20%",
    duration: 5,
    delay: 0.8,
    size: "text-2xl",
  },
  {
    icon: "✦",
    left: "12%",
    top: "62%",
    duration: 4,
    delay: 1.2,
    size: "text-lg",
  },
  {
    icon: "୨୧",
    left: "86%",
    top: "66%",
    duration: 5.5,
    delay: 1.5,
    size: "text-xl",
  },
  {
    icon: "♡",
    left: "4%",
    top: "82%",
    duration: 4.8,
    delay: 0.4,
    size: "text-lg",
  },
  {
    icon: "✧",
    left: "94%",
    top: "82%",
    duration: 4.3,
    delay: 1,
    size: "text-xl",
  },
];

const Home = () => {
  const getInitialSearch = () => {
    if (typeof window === "undefined") return "";

    return (
      new URLSearchParams(window.location.search).get("search") ?? ""
    );
  };

  const [searchQuery, setSearchQuery] = useState<string>(getInitialSearch);
  const [cosProducts, setCosProducts] = useState<Product[]>([]);
  const [wigProducts, setWigProducts] = useState<Product[]>([]);
  const [makeProducts, setMakeProducts] = useState<Product[]>([]);
  const [cosMeta, setCosMeta] = useState({ page: 1, totalPages: 1 });
  const [wigMeta, setWigMeta] = useState({ page: 1, totalPages: 1 });
  const [makeMeta, setMakeMeta] = useState({ page: 1, totalPages: 1 });
  const [showTopButton, setShowTopButton] = useState(false);
  const productResultsRef = useRef<HTMLDivElement>(null);

  const filterProducts = (items: Product[], term: string) => {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) return items;

    return items.filter((product) => {
      const haystack = [
        product.name,
        product.type,
        product.ver,
        product.size,
        product.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedTerm);
    });
  };

  useEffect(() => {
    const syncSearchFromUrl = () => {
      setSearchQuery(getInitialSearch());
    };

    window.addEventListener("popstate", syncSearchFromUrl);

    return () => {
      window.removeEventListener("popstate", syncSearchFromUrl);
    };
  }, []);

  const loadSectionPage = async (type: "COS" | "WIG" | "MAKEUP", page: number) => {
    try {
      const query = searchQuery.trim();
      const url = API.productsByType(type, query || undefined, page, 12);
      const res = await fetch(url);

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.warn(`Fetch ${url} returned ${res.status}: ${txt}`);

        if (type === "COS") {
          setCosProducts([]);
          setCosMeta({ page: 1, totalPages: 1 });
        }
        if (type === "WIG") {
          setWigProducts([]);
          setWigMeta({ page: 1, totalPages: 1 });
        }
        if (type === "MAKEUP") {
          setMakeProducts([]);
          setMakeMeta({ page: 1, totalPages: 1 });
        }

        return;
      }

      const data = await res.json();
      const items = filterProducts(extractProductsList(data) as Product[], query);
      const pagination = extractPagination(data);
      const currentPage = Number(pagination?.page ?? page ?? 1);
      const totalPages = Number(
        pagination?.totalPages ?? pagination?.total_pages ?? 1
      );

      if (type === "COS") {
        setCosProducts(items);
        setCosMeta({
          page: currentPage,
          totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
        });
      }

      if (type === "WIG") {
        setWigProducts(items);
        setWigMeta({
          page: currentPage,
          totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
        });
      }

      if (type === "MAKEUP") {
        setMakeProducts(items);
        setMakeMeta({
          page: currentPage,
          totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
        });
      }
    } catch (err) {
      console.error("Failed to fetch products for type", type, err);
      if (type === "COS") {
        setCosProducts([]);
        setCosMeta({ page: 1, totalPages: 1 });
      }
      if (type === "WIG") {
        setWigProducts([]);
        setWigMeta({ page: 1, totalPages: 1 });
      }
      if (type === "MAKEUP") {
        setMakeProducts([]);
        setMakeMeta({ page: 1, totalPages: 1 });
      }
    }
  };

  useEffect(() => {
    loadSectionPage("COS", 1);
    loadSectionPage("WIG", 1);
    loadSectionPage("MAKEUP", 1);
  }, [searchQuery]);


    useEffect(() => {
    if (!searchQuery.trim()) return;

    const hasResults =
      cosProducts.length > 0 ||
      wigProducts.length > 0 ||
      makeProducts.length > 0;

    if (!hasResults) return;

    const timer = setTimeout(() => {
      productResultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    cosProducts,
    wigProducts,
    makeProducts,
  ]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    const params = new URLSearchParams(window.location.search);

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    window.history.pushState({}, "", newUrl);
    setSearchQuery(trimmed);
  };

  const goToPage = async (type: "COS" | "WIG" | "MAKEUP", nextPage: number) => {
    const currentMeta =
      type === "COS" ? cosMeta : type === "WIG" ? wigMeta : makeMeta;

    if (nextPage < 1 || nextPage > currentMeta.totalPages) return;

    await loadSectionPage(type, nextPage);
  };
  useEffect(() => {
  const handleScroll = () => {
    setShowTopButton(window.scrollY > 500);
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-[10%] h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="absolute -right-32 top-[35%] h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="absolute left-[30%] bottom-0 h-72 w-72 rounded-full bg-fuchsia-200/20 blur-3xl" />
      </div>

      {/* Floating decorations */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {floatingItems.map((item, index) => (
          <motion.span
            key={index}
            className={`absolute select-none text-pink-300/60 ${item.size}`}
            style={{
              left: item.left,
              top: item.top,
            }}
            animate={{
              y: [0, -14, 0],
              x: [0, 5, 0],
              rotate: [-5, 5, -5],
              opacity: [0.25, 0.8, 0.25],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.span>
        ))}
      </div>

      <Header
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <Statistics />
      </motion.div>
 <div ref={productResultsRef}>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <ProductSection
          id="costume"
          title="COSTUME"
          products={cosProducts}
          page={cosMeta.page}
          totalPages={cosMeta.totalPages}
          hasMore={cosMeta.page < cosMeta.totalPages}
          onPrevPage={() => goToPage("COS", cosMeta.page - 1)}
          onNextPage={() => goToPage("COS", cosMeta.page + 1)}
        />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <ProductSection
          id="wig"
          title="WIG"
          products={wigProducts}
          page={wigMeta.page}
          totalPages={wigMeta.totalPages}
          hasMore={wigMeta.page < wigMeta.totalPages}
          onPrevPage={() => goToPage("WIG", wigMeta.page - 1)}
          onNextPage={() => goToPage("WIG", wigMeta.page + 1)}
        />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <ProductSection
          id="makeup"
          title="MAKEUP"
          products={makeProducts}
          page={makeMeta.page}
          totalPages={makeMeta.totalPages}
          hasMore={makeMeta.page < makeMeta.totalPages}
          onPrevPage={() => goToPage("MAKEUP", makeMeta.page - 1)}
          onNextPage={() => goToPage("MAKEUP", makeMeta.page + 1)}
        />
      </motion.div>
</div>
      <Footer />
{showTopButton && (
  <button
    type="button"
    onClick={scrollToTop}
    aria-label="Back to top"
    className="
      fixed
      bottom-7
      right-7
      z-50

      flex
      h-14
      w-14
      items-center
      justify-center

      rounded-[22px]

      border
      border-pink-100

      bg-gradient-to-br
      from-pink-100
      via-pink-200
      to-pink-300

      text-3xl
      font-black
      text-pink-500

      shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-5px_8px_rgba(236,72,153,0.18),0_8px_18px_rgba(236,72,153,0.2)]

      transition-all
      duration-200

      hover:-translate-y-1
      hover:scale-105

      active:translate-y-[2px]
      active:scale-95
      active:shadow-[inset_0_4px_8px_rgba(236,72,153,0.18),0_4px_10px_rgba(236,72,153,0.15)]
    "
  >
    ↑
  </button>
)}
    </div>
  );
};

export default Home;