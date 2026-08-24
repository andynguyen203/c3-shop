"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import { getAssetPath } from "@/utils/assetPath";
import CloseIcon from "@/components/icons/CloseIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import CheckIcon from "@/components/icons/CheckIcon";

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

const COMMON_SPECS = [
  "Xuất xứ",
  "Quy cách",
  "Thành phần",
  "Hạn sử dụng",
  "Nhà sản xuất",
  "Dạng bào chế",
  "Đối tượng dùng",
];

const AVAILABLE_GALLERY_IMAGES = [
  { path: "/images/C-01-01.jpg", name: "C-01-01.jpg", desc: "Kem đánh răng Sunstar" },
  { path: "/images/C-01-02.jpg", name: "C-01-02.jpg", desc: "Nước súc miệng Propolinse" },
  { path: "/images/C-02-01.jpg", name: "C-02-01.jpg", desc: "Tăng chiều cao GH Creation" },
  { path: "/images/C-03-01.jpg", name: "C-03-01.jpg", desc: "Bọt vệ sinh Laurier" },
  { path: "/images/C-04-01.jpg", name: "C-04-01.jpg", desc: "Nhỏ mắt Santen PC" },
  { path: "/images/C-04-02.jpg", name: "C-04-02.jpg", desc: "Nhỏ mắt Rohto Vita" },
];

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
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [stock, setStock] = useState<number>(100);
  const [order, setOrder] = useState<number>(1);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [specRows, setSpecRows] = useState<SpecRow[]>([]);
  const [isCustomPath, setIsCustomPath] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setId(initialProduct.id);
      setName(initialProduct.name);
      setPrice(initialProduct.price);
      setOldPrice(initialProduct.oldPrice ? String(initialProduct.oldPrice) : "");
      setTag(initialProduct.tag || "");
      setStock(initialProduct.stock ?? 100);
      setOrder(initialOrder);
      setImage(initialProduct.image || "/images/C-01-01.jpg");
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
      setPrice(100000);
      setOldPrice("");
      setTag("Mới");
      setStock(100);
      setOrder(initialOrder);
      setImage("/images/C-01-01.jpg");
      setDescription("CÔNG DỤNG:\n- Công dụng 1...\n- Công dụng 2...");
      setSpecRows([
        { key: "Xuất xứ", value: "Nhật Bản" },
        { key: "Quy cách", value: "" },
        { key: "Thành phần", value: "" },
      ]);
    }
  }, [initialProduct, initialOrder, isOpen]);

  if (!isOpen) return null;

  const handleAddSpecRow = (defaultKey = "") => {
    setSpecRows([...specRows, { key: defaultKey, value: "" }]);
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
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isEdit
                ? "Chỉnh sửa thông tin, hình ảnh & thông số kỹ thuật"
                : "Nhập đầy đủ thông tin để lưu sản phẩm vào hệ thống"}
            </p>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors ml-1 cursor-pointer"
              title="Đóng"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT 1 (Bên trái): Thông tin cơ bản, Giá bán, Hình ảnh, Mô tả */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  1. Thông Tin Sản Phẩm & Hình Ảnh
                </span>
              </div>

              {/* Tên sản phẩm */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Tên sản phẩm <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: VIÊN UỐNG TĂNG CHIỀU CAO..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
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
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Giá niêm yết cũ (đ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="Để trống nếu ko giảm"
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

              {/* Kho ảnh có sẵn trong public/images/ */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                      Chọn ảnh sản phẩm
                    </label>
                    <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 text-[10px] font-bold">
                      public/images/
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomPath(!isCustomPath)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isCustomPath ? "Ẩn nhập đường dẫn" : "Nhập đường dẫn khác"}
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVAILABLE_GALLERY_IMAGES.map((imgItem) => {
                    const isSelected = image === imgItem.path;

                    return (
                      <button
                        key={imgItem.path}
                        type="button"
                        onClick={() => {
                          setImage(imgItem.path);
                          setIsCustomPath(false);
                        }}
                        className={`group relative flex flex-col items-center rounded-xl p-1.5 border transition-all cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-950/50 shadow-xs"
                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500"
                        }`}
                        title={imgItem.desc}
                      >
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700/60 p-1 mb-1">
                          <Image
                            src={getAssetPath(imgItem.path)}
                            alt={imgItem.desc}
                            fill
                            className="object-contain"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                              <CheckIcon className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate w-full text-center">
                          {imgItem.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected image detail info */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-zinc-700/60">
                  <div className="flex items-center gap-1.5 truncate">
                    <span>Đang chọn:</span>
                    <strong className="font-mono text-indigo-600 dark:text-indigo-400 truncate">
                      {image || "(Chưa chọn ảnh)"}
                    </strong>
                  </div>
                </div>

                {/* Custom path input field */}
                {isCustomPath && (
                  <div className="pt-1 animate-in fade-in duration-150">
                    <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Đường dẫn file ảnh trong public hoặc link URL:
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="/images/C-05-01.jpg hoặc https://..."
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Mô tả chi tiết - Mở rộng thoải mái */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Mô tả & Hướng dẫn sử dụng
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    (Hỗ trợ viết nhiều dòng)
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập thông tin chi tiết về sản phẩm, công dụng, hướng dẫn sử dụng, đối tượng khuyên dùng, lưu ý..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 leading-relaxed min-h-[170px] resize-y"
                />
              </div>
            </div>

            {/* CỘT 2 (Bên phải): Thông số / Thành phần chi tiết - Mở rộng */}
            <div className="lg:col-span-6 space-y-3 bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    2. Thông Số / Thành Phần Chi Tiết
                  </span>
                  <span className="ml-2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 text-[11px] font-black">
                    {specRows.length} mục
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddSpecRow()}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer shadow-2xs"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Thêm thông số
                </button>
              </div>

              {/* Quick Preset Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Thêm nhanh mẫu phổ biến:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SPECS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSpecRow(s)}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer shadow-2xs"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Spec rows */}
              <div className="max-h-[560px] overflow-y-auto space-y-3 pr-1 mt-2">
                {specRows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center text-zinc-400">
                    <span className="text-3xl mb-1.5">📋</span>
                    <p className="text-xs font-medium">Chưa có thông số nào.</p>
                    <button
                      type="button"
                      onClick={() => handleAddSpecRow("Xuất xứ")}
                      className="mt-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
                    >
                      + Thêm thông số đầu tiên
                    </button>
                  </div>
                ) : (
                  specRows.map((row, index) => {
                    const isComponentOrLong =
                      row.key.toLowerCase().includes("thành phần") ||
                      row.key.toLowerCase().includes("công dụng") ||
                      row.key.toLowerCase().includes("hướng dẫn") ||
                      row.value.length > 60;

                    return (
                      <div
                        key={index}
                        className={`rounded-2xl border bg-white dark:bg-zinc-900 p-3.5 shadow-2xs space-y-2 transition-colors ${
                          row.key.toLowerCase().includes("thành phần")
                            ? "border-indigo-200 dark:border-indigo-900/60 ring-1 ring-indigo-500/10"
                            : "border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Tên thông số (VD: Thành phần, Xuất xứ...)"
                            value={row.key}
                            onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecRow(index)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Xóa thông số này"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <textarea
                          rows={isComponentOrLong ? 5 : 3}
                          placeholder={
                            row.key.toLowerCase().includes("thành phần")
                              ? "VD: - Alpha-GPC: Hỗ trợ não bộ...\n- Arginine: Kích thích hormone tăng trưởng...\n- Canxi san hô: Bổ sung canxi tự nhiên..."
                              : "Nội dung chi tiết thông số..."
                          }
                          value={row.value}
                          onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/60 p-3 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 leading-relaxed resize-y font-sans"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
