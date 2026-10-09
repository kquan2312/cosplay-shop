import { motion } from "framer-motion";
import ProductCard from "../ui/ProductCard";
import type { Product } from "../../types/product";
import SectionTitle from "../ui/SectionTitle";

interface ProductSectionProps {
  id?: string;
  title: string;
  products: Product[];
  page?: number;
  totalPages?: number;
  hasMore?: boolean;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

const ProductSection = ({
  id,
  title,
  products,
  page = 1,
  totalPages = 1,
  hasMore = false,
  onPrevPage,
  onNextPage,
}: ProductSectionProps) => {
  return (
    <section
      id={id}
      className="relative py-20"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionTitle title={title} />

        {products.length > 0 && (
          <div className="mt-4 text-center text-sm font-medium text-gray-500">
            Trang {page}/{totalPages}
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: "easeOut",
              }}
              whileHover={{
                y: -6,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-4xl text-pink-200">♡</div>

            <p className="mt-3 text-sm text-gray-400">
              Không tìm thấy sản phẩm ✿
            </p>
          </div>
        )}

        {(onPrevPage || onNextPage) && (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <motion.button
              type="button"
              onClick={onPrevPage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white text-lg font-bold text-pink-500 shadow-sm transition hover:border-pink-400 hover:bg-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12 sm:text-xl"
              aria-label="Previous page"
              disabled={!onPrevPage || page <= 1}
            >
              ←
            </motion.button>

            <div className="flex items-center gap-2 rounded-full border border-pink-100 bg-white px-3 py-2 shadow-sm sm:px-4">
              <span className="text-xs font-semibold text-pink-500 sm:text-sm">Trang</span>
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#C572DE] px-2 text-xs font-bold text-white sm:h-8 sm:min-w-8 sm:text-sm">
                {page}
              </span>
              <span className="text-xs text-gray-500 sm:text-sm">/ {totalPages}</span>
            </div>

            <motion.button
              type="button"
              onClick={onNextPage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white text-lg font-bold text-pink-500 shadow-sm transition hover:border-pink-400 hover:bg-pink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12 sm:text-xl"
              aria-label="Next page"
              disabled={!onNextPage || !hasMore}
            >
              →
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;