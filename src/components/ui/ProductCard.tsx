import type { Product } from "../../types/product";
import { formatProductPrice, getProductPriceAmount } from "../../utils/productPrice";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const images = product.images ?? [];
  const thumbnail = images.find((img) => img.isThumbnail)?.url || images[0]?.url || "";
  const fesPrice = getProductPriceAmount(product.price, "fes");
  const testShootPrice = getProductPriceAmount(product.price, "testShoot");

  const handleOpenDetail = () => {
    const nextUrl = `/product/${product.id}`;
    window.history.pushState({}, "", nextUrl);
    window.dispatchEvent(new Event("app-route-change"));
  };

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl sm:rounded-3xl">
      <div className="h-44 overflow-hidden rounded-t-2xl bg-gray-100 sm:h-64 sm:rounded-t-3xl lg:h-80">
        <img
          src={thumbnail}
          alt={product.name}
          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2 p-3 sm:space-y-3 sm:p-5">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <span className="rounded-full bg-[#F4E6FB] px-2 py-1 text-[10px] font-semibold text-[#8E43C5] sm:px-3 sm:text-xs">
            {product.type}
          </span>

          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] sm:px-3 sm:text-xs">
            {product.size || "-"}
          </span>
        </div>

        <h3 className="line-clamp-2 text-sm font-bold sm:text-xl">{product.name}</h3>

        <p className="text-sm text-gray-500">{product.ver || "-"}</p>

        <p className="line-clamp-2 text-sm text-gray-400">{product.note || "-"}</p>

        <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
          <div className="space-y-1 text-[10px] sm:text-sm">
            <p className="font-bold text-[#A04BC9]">
              FES: {formatProductPrice(fesPrice)}
            </p>
            <p className="font-semibold text-gray-600">
              Test/Shoot: {formatProductPrice(testShootPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenDetail}
            className="w-full rounded-full bg-[#C572DE] px-3 py-2 text-xs font-semibold text-white hover:bg-[#B363D8] sm:w-auto sm:px-4 sm:text-sm"
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
