import { useEffect, useMemo, useState } from "react";
import { showToast } from "../components/ui/Toast";
import { API, extractPagination, extractProductsList } from "../config/api";
import { defaultShopSettings, getSiteSettings, saveSiteSettings, type ShopSettings } from "../config/siteSettings";
import type { Product } from "../types/product";

interface ProductFormState {
  id?: string;
  name: string;
  type: "COS" | "WIG" | "MAKEUP";
  ver: string;
  price: string;
  size: string;
  note: string;
  file: File | null;
  isThumbnail: boolean;
}

const emptyForm: ProductFormState = {
  name: "",
  type: "COS",
  ver: "",
  price: "",
  size: "",
  note: "",
  file: null,
  isThumbnail: true,
};

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(defaultShopSettings);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      const firstPageRes = await fetch(API.productsPage(1, 1000));
      if (!firstPageRes.ok) throw new Error(`Failed to load products: ${firstPageRes.status}`);

      const firstPageData = await firstPageRes.json();
      const firstPageItems = extractProductsList(firstPageData) as Product[];
      const pagination = extractPagination(firstPageData);
      const totalPages = Number(pagination?.totalPages ?? pagination?.total_pages ?? 1);

      if (!Number.isFinite(totalPages) || totalPages <= 1) {
        setProducts(firstPageItems);
        return;
      }

      const allProducts: Product[] = [...firstPageItems];

      for (let page = 2; page <= totalPages; page += 1) {
        const res = await fetch(API.productsPage(page, 1000));
        if (!res.ok) break;

        const pageData = await res.json();
        allProducts.push(...(extractProductsList(pageData) as Product[]));
      }

      setProducts(allProducts);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm.");
    }
  };

  useEffect(() => {
    loadProducts();

    const loadSiteSettings = async () => {
      const nextSettings = await getSiteSettings();
      setSettingsForm(nextSettings);
    };

    loadSiteSettings();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.type,
        product.ver ?? "",
        product.size ?? "",
        product.note ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [products, search]);

  const uploadProductImage = async (productId: string, file: File) => {
    const body = new FormData();
    body.append("productId", productId);
    body.append("file", file);
    body.append("isThumbnail", String(form.isThumbnail));

    const res = await fetch(API.productImages, {
      method: "POST",
      body,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Upload ảnh thất bại: ${text || res.status}`);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setForm({
      id: product.id,
      name: product.name ?? "",
      type: (product.type as ProductFormState["type"]) ?? "COS",
      ver: product.ver ?? "",
      price: product.price == null ? "" : String(product.price),
      size: product.size ?? "",
      note: product.note ?? "",
      file: null,
      isThumbnail: true,
    });
    setError(null);
    setSuccess(null);
    setFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        ver: form.ver,
        price: form.price ? Number(form.price) : 0,
        size: form.size,
        note: form.note,
      };

      const url = editingId ? `${API.products}/${editingId}` : API.products;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Lỗi ${res.status}`);
      }

      const productData = (await res.json()) as Product;
      const createdId = productData?.id ?? editingId;

      if (form.file && createdId) {
        await uploadProductImage(createdId, form.file);
      }

      const successMessage = editingId ? "Cập nhật sản phẩm thành công." : "Tạo sản phẩm thành công.";
      setSuccess(successMessage);
      showToast(successMessage, "success");
      setFormOpen(false);
      resetForm();
      await loadProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`${API.products}/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Xóa thất bại: ${res.status}`);
      }

      const successMessage = "Xóa sản phẩm thành công.";
      setSuccess(successMessage);
      showToast(successMessage, "success");
      await loadProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể xóa sản phẩm.";
      setError(message);
      showToast(message, "error");
    }
  };

  const handleSettingsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const saved = await saveSiteSettings(settingsForm);
      setSettingsForm(saved);
      const successMessage = "Cập nhật thông tin website thành công.";
      setSuccess(successMessage);
      showToast(successMessage, "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể cập nhật thông tin website.";
      setError(message);
      showToast(message, "error");
    }
  };

  const tabButtonClass = (tab: "products" | "settings") =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      activeTab === tab
        ? "bg-[#C572DE] text-white shadow-sm"
        : "border border-gray-200 bg-white text-gray-600 hover:border-[#C572DE] hover:text-[#C572DE]"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-800 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[4px] text-pink-500">Admin</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Quản lý website</h1>
          </div>

          <div className="flex items-center gap-3">
            <a href="/" className="rounded-full border border-pink-500 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-500 hover:text-white">
              Về trang chủ
            </a>
            {activeTab === "products" && (
              <button
                type="button"
                onClick={openCreateForm}
                className="rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-600"
              >
                + Thêm mới
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          <button type="button" onClick={() => setActiveTab("products")} className={tabButtonClass("products")}>Sản phẩm</button>
          <button type="button" onClick={() => setActiveTab("settings")} className={tabButtonClass("settings")}>Thông tin shop</button>
        </div>

        {activeTab === "products" ? (
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200 md:p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-md">
                <label className="mb-1 block text-sm font-medium text-gray-700">Tìm kiếm</label>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tên, loại, size, ver..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                />
              </div>

              <div className="rounded-full bg-pink-100 px-3 py-1.5 text-sm font-semibold text-pink-600">
                {filteredProducts.length} sản phẩm
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            {success && (
              <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-sm text-gray-500">
                    <th className="px-3 py-2">Tên</th>
                    <th className="px-3 py-2">Loại</th>
                    <th className="px-3 py-2">Giá</th>
                    <th className="px-3 py-2">Size</th>
                    <th className="px-3 py-2">Mô tả</th>
                    <th className="px-3 py-2 text-right">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="rounded-2xl bg-gray-50 text-sm align-top">
                      <td className="rounded-l-2xl px-3 py-3 font-medium text-gray-800">{product.name}</td>
                      <td className="px-3 py-3">{product.type}</td>
                      <td className="px-3 py-3">
                        {product.price ? `${Number(product.price).toLocaleString("vi-VN")}đ` : "0đ"}
                      </td>
                      <td className="px-3 py-3">{product.size || "-"}</td>
                      <td className="max-w-xs px-3 py-3 text-gray-600">{product.note || "-"}</td>
                      <td className="rounded-r-2xl px-3 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-600"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-gray-500">
                  Không có sản phẩm phù hợp.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200 md:p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-bold">Thông tin cửa hàng</h2>
              <p className="mt-1 text-sm text-gray-500">Cập nhật logo, slogan, địa chỉ hiển thị trên website.</p>
            </div>

            {error && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            {success && (
              <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>
            )}

            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Tên shop</label>
                  <input
                    value={settingsForm.siteName}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, siteName: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Slogan</label>
                  <input
                    value={settingsForm.slogan}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, slogan: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    value={settingsForm.address}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, address: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    value={settingsForm.tel}
                    onChange={(event) => setSettingsForm((prev) => ({ ...prev, tel: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Logo website</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      setSettingsForm((prev) => ({ ...prev, logo: String(reader.result ?? prev.logo) }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full rounded-xl border border-dashed border-gray-200 p-2 text-sm"
                />
                <div className="mt-3 flex items-center gap-3">
                  {settingsForm.logo ? (
                    <img src={settingsForm.logo} alt="Logo preview" className="h-16 w-16 rounded-full object-cover ring-2 ring-[#F2D7FF]" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C572DE] text-lg font-bold text-white">M</div>
                  )}
                  <span className="text-sm text-gray-500">Preview logo</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-[#C572DE] px-5 py-2.5 font-semibold text-white hover:bg-[#B363D8]"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Loại</label>
                  <select
                    value={form.type}
                    onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as ProductFormState["type"] }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  >
                    <option value="COS">COS</option>
                    <option value="WIG">WIG</option>
                    <option value="MAKEUP">MAKEUP</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Giá</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Ver</label>
                  <input
                    value={form.ver}
                    onChange={(event) => setForm((prev) => ({ ...prev, ver: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Size</label>
                  <input
                    value={form.size}
                    onChange={(event) => setForm((prev) => ({ ...prev, size: event.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  value={form.note}
                  onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                  className="min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setForm((prev) => ({ ...prev, file: event.target.files?.[0] ?? null }))}
                  className="w-full rounded-xl border border-dashed border-gray-200 p-2 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isThumbnail}
                  onChange={(event) => setForm((prev) => ({ ...prev, isThumbnail: event.target.checked }))}
                />
                Đặt ảnh này làm thumbnail
              </label>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                  className="rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-pink-500 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Đang xử lý..." : editingId ? "Lưu" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
