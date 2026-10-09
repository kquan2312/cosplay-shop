import { useEffect, useMemo, useState } from "react";
import { API } from "../config/api";
import type { Product } from "../types/product";

interface ProductDetailProps {
  productId: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setSelectedImage("");

      try {
        const res = await fetch(`${API.products}/${productId}`);

        if (!res.ok) {
          throw new Error(`Failed to load product: ${res.status}`);
        }

        const data = await res.json();
        setProduct(data as Product);
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy sản phẩm hoặc có lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const galleryImages = useMemo(() => {
    if (!product?.images?.length) return [];

    return product.images.filter((img) => !img.isThumbnail);
  }, [product]);

  const thumbnailImage = product?.images?.find((img) => img.isThumbnail)?.url || product?.images?.[0]?.url || "";

  const mainImage = selectedImage || thumbnailImage || "";

  const openPreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setPreviewImage(imageUrl);
  };

  const previewableImage = previewImage || thumbnailImage || "";

  const closePreview = () => {
    setPreviewImage(null);
    setSelectedImage(thumbnailImage || "");
  };

  useEffect(() => {
    if (!product) return;
    if (thumbnailImage) {
      setSelectedImage(thumbnailImage);
    }
  }, [product, thumbnailImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-20 text-center text-lg font-medium text-gray-600">
        Đang tải chi tiết sản phẩm...
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "/";
  };

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <p className="text-lg font-semibold text-red-500">{error || "Sản phẩm không tồn tại."}</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-6 inline-block rounded-full bg-pink-500 px-5 py-2.5 font-semibold text-white"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const price = Number(product.price ?? 0);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-gray-800">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-block text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Quay lại
        </button>

        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="relative w-full max-w-4xl rounded-3xl bg-white p-3 shadow-2xl">
              <button
                type="button"
                onClick={closePreview}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-700 shadow-sm hover:bg-gray-100"
                aria-label="Close preview"
              >
                ×
              </button>

              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={previewableImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <div>
              <div className="overflow-hidden rounded-3xl bg-gray-100">
                {mainImage ? (
                  <img src={mainImage} alt={product.name} className="h-[540px] w-full object-contain p-3" />
                ) : (
                  <div className="flex h-[540px] items-center justify-center text-gray-400">No image</div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <div className="flex gap-4 pb-1">
                    {galleryImages.map((image, index) => (
                      <button
                        key={`${image.id ?? image.url}-${index}`}
                        type="button"
                        onClick={() => openPreview(image.url)}
                        className={`h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 bg-gray-100 transition ${
                          selectedImage === image.url ? "border-pink-500" : "border-transparent"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="mb-3 inline-block w-fit rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[2px] text-pink-600">
                {product.type}
              </span>

              <h1 className="text-4xl font-extrabold leading-tight">{product.name}</h1>

              <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                <span className="rounded-full bg-gray-100 px-3 py-1">{product.size || "Size: -"}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">{product.ver || "Ver: -"}</span>
              </div>

              <div className="mt-6 text-3xl font-bold text-pink-600">
                {Number.isFinite(price) ? price.toLocaleString("vi-VN") : "0"}đ
              </div>

              <p className="mt-6 text-base leading-7 text-gray-600">
                {product.note || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>

              <button
                type="button"
                className="mt-8 inline-flex w-fit rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
