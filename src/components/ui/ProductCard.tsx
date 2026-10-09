interface ProductImage {
  url: string;
  isThumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  type: string;
  ver?: string | null;
  price?: string | number | null;
  size?: string | null;
  note?: string | null;
  images?: ProductImage[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const images = product.images ?? [];
  const thumbnail = images.find((img) => img.isThumbnail)?.url || images[0]?.url || "";
  const numericPrice = Number(product.price ?? 0);

  const handleOpenDetail = () => {
    const nextUrl = `/product/${product.id}`;
    window.history.pushState({}, "", nextUrl);
    window.dispatchEvent(new Event("app-route-change"));
  };

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">
      <div className="h-80 overflow-hidden rounded-t-3xl bg-gray-100">
        <img
          src={thumbnail}
          alt={product.name}
          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex gap-2">
          <span className="rounded-full bg-[#F4E6FB] px-3 py-1 text-xs font-semibold text-[#8E43C5]">
            {product.type}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
            {product.size || "-"}
          </span>
        </div>

        <h3 className="text-xl font-bold">{product.name}</h3>

        <p className="text-sm text-gray-500">{product.ver || "-"}</p>

        <p className="line-clamp-2 text-sm text-gray-400">{product.note || "-"}</p>

        <div className="flex items-center justify-between pt-3">
          <span className="text-xl font-bold text-[#A04BC9]">
            {Number.isFinite(numericPrice) ? numericPrice.toLocaleString("vi-VN") : "0"}
            đ
          </span>

          <button
            type="button"
            onClick={handleOpenDetail}
            className="rounded-full bg-[#C572DE] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B363D8]"
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;