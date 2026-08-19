"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { getAssetPath } from "@/utils/assetPath";
import CloseIcon from "@/components/icons/CloseIcon";
import PlusIcon from "@/components/icons/PlusIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, "id"> & { id?: string; order?: number }) => void;
  initialProduct?: Product | null;
  initialOrder?: number;
}

interface SpecRow {
  key: string;
  value: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  initialOrder = 1,
}: Props) {
  const isEdit = Boolean(initialProduct);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("C-01");
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [stock, setStock] = useState<number>(100);
  const [order, setOrder] = useState<number>(1);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [specRows, setSpecRows] = useState<SpecRow[]>([]);

  useEffect(() => {
    if (initialProduct) {
      setId(initialProduct.id);
      setName(initialProduct.name);
      setCategoryId(initialProduct.categoryId);
      setPrice(initialProduct.price);
      setOldPrice(initialProduct.oldPrice ? String(initialProduct.oldPrice) : "");
      setTag(initialProduct.tag || "");
      setStock(initialProduct.stock ?? 100);
      setOrder(initialOrder);
      setImage(initialProduct.image || "");
      setDescription(initialProduct.description || "");

      if (initialProduct.specs) {
        setSpecRows(
          Object.entries(initialProduct.specs).map(([k, v]) => ({
            key: k,
            value: v,
          }))
        );
      } else {
        setSpecRows([
          { key: "Xuất xứ", value: "Nhật Bản" },
          { key: "Quy cách", value: "" },
          { key: "Thành phần", value: "" },
        ]);
      }
    } else {
      // Defaults for new product
      setId("");
      setName("");
      setCategoryId("C-04");
      setPrice(100000);
      setOldPrice("");
      setTag("Mới");
      setStock(100);
      setOrder(initialOrder);
      setImage("/images/C-04-02.jpg");
      setDescription("CÔNG DỤNG:\n- Công dụng 1...\n- Công dụng 2...");
      setSpecRows([
        { key: "Xuất xứ", value: "Nhật Bản" },
        { key: "Quy cách", value: "" },
        { key: "Thành phần", value: "" },
      ]);
    }
  }, [initialProduct, initialOrder, isOpen]);

  if (!isOpen) return null;

  const handleAddSpecRow = () => {
    setSpecRows([...specRows, { key: "", value: "" }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecRows(specRows.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const next = [...specRows];
    next[index][field] = val;
    setSpecRows(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }

    // Build specs record
    const specsRecord: Record<string, string> = {};
    specRows.forEach((row) => {
      if (row.key.trim()) {
        specsRecord[row.key.trim()] = row.value.trim();
      }
    });

    onSave({
      id: isEdit ? id : id.trim() || undefined,
      name: name.trim(),
      categoryId,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      tag: tag.trim() || undefined,
      stock: Number(stock),
      order: Number(order),
      image: image.trim(),
      description: description.trim(),
      specs: Object.keys(specsRecord).length > 0 ? specsRecord : undefined,
      rating: initialProduct?.rating ?? 5.0,
      reviews: initialProduct?.reviews ?? 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isEdit ? `Mã sản phẩm: #${id}` : "Nhập đầy đủ các thông tin để thêm sản phẩm mới vào danh mục"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tên & Mã & Danh mục */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Tên sản phẩm <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Thuốc Nhỏ Mắt Rohto Vita Nhật Bản"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Mã sản phẩm (ID)
              </label>
              <input
                type="text"
                disabled={isEdit}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Tự động tạo nếu để trống"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Danh mục */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Danh mục
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Tag */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Huy hiệu (Tag)
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
              >
                <option value="">(Không có)</option>
                <option value="Bán chạy nhất">Bán chạy nhất</option>
                <option value="Hot">Hot</option>
                <option value="Mới">Mới</option>
                <option value="Khuyên dùng">Khuyên dùng</option>
              </select>
            </div>

            {/* Thứ tự */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Thứ tự bán chạy (Order)
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Giá & Giá cũ & Tồn kho */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Giá bán hiện tại (đ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={1000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Giá gốc (oldPrice)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="Ẩn nếu <= Giá bán"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Số lượng tồn kho
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Đường dẫn hình ảnh (Image Path / URL)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/C-04-02.jpg hoặc link ảnh online"
                className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
              />
              {image && (
                <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1">
                  <Image
                    src={getAssetPath(image)}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Mô tả chi tiết sản phẩm
              </label>
              <span className="text-[11px] text-zinc-400">
                (Dùng phím Enter để xuống dòng theo từng gạch đầu dòng &apos;-&apos;)
              </span>
            </div>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="CÔNG DỤNG:&#10;- Giúp tăng tuần hoàn máu...&#10;- Giảm mỏi mắt..."
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 whitespace-pre-line leading-relaxed font-sans"
            />
          </div>

          {/* Thông số kỹ thuật (Specs) */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Bảng thông số kỹ thuật
              </label>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <PlusIcon className="h-3.5 w-3.5" /> Thêm dòng
              </button>
            </div>

            <div className="space-y-3">
              {specRows.map((row, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60">
                  <input
                    type="text"
                    placeholder="Tên thông số (VD: Xuất xứ, Thành phần)"
                    value={row.key}
                    onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                    className="w-1/3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-white outline-none"
                  />
                  <textarea
                    rows={2}
                    placeholder="Nội dung thông số (hỗ trợ xuống dòng)"
                    value={row.value}
                    onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                    className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 outline-none whitespace-pre-line leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecRow(idx)}
                    className="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Xóa dòng này"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-md transition-colors cursor-pointer"
            >
              {isEdit ? "Cập nhật sản phẩm" : "Lưu sản phẩm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
