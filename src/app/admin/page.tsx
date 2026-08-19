"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProductData } from "@/context/ProductDataContext";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/data/products";
import { getAssetPath } from "@/utils/assetPath";
import ProductFormModal from "./ProductFormModal";
import SearchIcon from "@/components/icons/SearchIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import StarIcon from "@/components/icons/StarIcon";

const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

export default function AdminPage() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefault,
    exportJSON,
    importJSON,
  } = useProductData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Map order for quick lookup
  const orderMap = useMemo(() => {
    return new Map<string, number>(orders.map((o) => [o.productId, o.order]));
  }, [orders]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "all" || p.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.tag && p.tag.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (#${id})?`)) {
      deleteProduct(id);
    }
  };

  const handleSaveProduct = (
    data: Omit<Product, "id"> & { id?: string; order?: number }
  ) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const jsonStr = exportJSON();
    navigator.clipboard.writeText(jsonStr);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = importJSON(importJsonText);
    if (success) {
      alert("Đã nhập dữ liệu JSON thành công!");
      setIsImportModalOpen(false);
      setImportJsonText("");
    } else {
      alert("Dữ liệu JSON không hợp lệ! Vui lòng kiểm tra lại cấu trúc mảng sản phẩm.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <span>Hệ thống Quản trị</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Quản Lý Sản Phẩm
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Thêm mới, sửa đổi giá, mô tả, thông số kỹ thuật và sắp xếp thứ tự hiển thị
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Thêm sản phẩm mới
            </button>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Tải về file products.json"
            >
              📥 Xuất file JSON
            </button>
            <button
              onClick={handleCopyJSON}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {copiedNotification ? "✓ Đã chép JSON" : "📋 Sao chép JSON"}
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              📤 Nhập JSON
            </button>
            <button
              onClick={() => {
                if (window.confirm("Khôi phục toàn bộ sản phẩm về dữ liệu mặc định ban đầu?")) {
                  resetToDefault();
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 px-3.5 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors cursor-pointer"
            >
              🔄 Khôi phục gốc
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              👁 Xem cửa hàng
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Tổng sản phẩm
            </span>
            <p className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
              {products.length}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Danh mục
            </span>
            <p className="mt-2 text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {CATEGORIES.length}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Bán chạy / Nổi bật
            </span>
            <p className="mt-2 text-3xl font-black text-amber-500">
              {products.filter((p) => p.tag).length}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Tổng lượng tồn kho
            </span>
            <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 mb-6 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm, mã ID, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
            />
            <SearchIcon className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Danh mục:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer focus:border-indigo-500"
            >
              <option value="all">Tất cả danh mục ({products.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({products.filter((p) => p.categoryId === cat.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="py-4 px-4 sm:px-6 w-16">Thứ tự</th>
                  <th className="py-4 px-4 sm:px-6">Sản phẩm</th>
                  <th className="py-4 px-4 sm:px-6">Danh mục</th>
                  <th className="py-4 px-4 sm:px-6">Giá bán</th>
                  <th className="py-4 px-4 sm:px-6">Tồn kho</th>
                  <th className="py-4 px-4 sm:px-6">Đánh giá</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400">
                      Không tìm thấy sản phẩm nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const cat = CATEGORIES.find((c) => c.id === p.categoryId);
                    const currentOrder = orderMap.get(p.id) ?? "-";

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        {/* Order Badge */}
                        <td className="py-4 px-4 sm:px-6 font-bold text-center">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                            {currentOrder}
                          </span>
                        </td>

                        {/* Product Info */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-1">
                              {p.image ? (
                                <Image
                                  src={getAssetPath(p.image)}
                                  alt={p.name}
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <div className="h-full w-full bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
                              )}
                            </div>
                            <div className="max-w-md">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-semibold text-zinc-400">
                                  #{p.id}
                                </span>
                                {p.tag && (
                                  <span className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-2 py-0.5 text-[10px] font-bold">
                                    {p.tag}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1 mt-0.5">
                                {p.name}
                              </h3>
                              <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                                {p.description.replace(/\n/g, " ")}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 sm:px-6">
                          <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {cat ? cat.name : p.categoryId}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {formatPrice(p.price)}
                            </span>
                            {p.oldPrice && p.oldPrice > p.price && (
                              <span className="text-xs text-zinc-400 line-through">
                                {formatPrice(p.oldPrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 font-semibold text-xs ${
                              p.stock > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-500 font-bold"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.stock > 0 ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            {p.stock > 0 ? `${p.stock} cái` : "Hết hàng"}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                            <StarIcon className="h-3.5 w-3.5 fill-current" />
                            <span>{p.rating}</span>
                            <span className="text-zinc-400 font-normal">
                              ({p.reviews})
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/product/${p.id}`}
                              target="_blank"
                              className="rounded-lg p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Xem chi tiết trên web"
                            >
                              👁
                            </Link>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="rounded-lg bg-rose-50 dark:bg-rose-950/60 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          initialProduct={editingProduct}
          initialOrder={editingProduct ? orderMap.get(editingProduct.id) : products.length + 1}
        />

        {/* Modal Import JSON */}
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                Nhập dữ liệu từ file JSON
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                {"Dán toàn bộ nội dung mã JSON của mảng sản phẩm ([ { id, name, ... } ]) vào ô dưới đây:"}
              </p>
              <textarea
                rows={10}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="[ { &quot;id&quot;: &quot;1&quot;, &quot;name&quot;: &quot;...&quot; } ]"
                className="w-full font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-zinc-900 dark:text-white outline-none focus:border-indigo-500 mb-4"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImportSubmit}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Xác nhận nhập
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
