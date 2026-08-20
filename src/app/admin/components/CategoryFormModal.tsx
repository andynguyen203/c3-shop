"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Category } from "@/data/categories";
import { useProductData } from "@/context/ProductDataContext";
import { getAssetPath } from "@/utils/assetPath";
import CloseIcon from "@/components/icons/CloseIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import {
  ToothIcon,
  PillIcon,
  HeartIcon,
  EyeIcon,
  DropIcon,
  ShirtIcon,
  DeviceIcon,
  HomeIcon,
  SparklesIcon,
} from "@/components/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (catData: Category, productIds?: string[]) => void;
  initialCategory?: Category | null;
  existingCount: number;
}

const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

const AVAILABLE_ICONS = [
  { name: "ToothIcon", label: "Răng miệng", Icon: ToothIcon },
  { name: "PillIcon", label: "Thuốc / TPCN", Icon: PillIcon },
  { name: "HeartIcon", label: "Sức khỏe / Nữ", Icon: HeartIcon },
  { name: "EyeIcon", label: "Mắt / Thị lực", Icon: EyeIcon },
  { name: "DropIcon", label: "Serum / Tinh chất", Icon: DropIcon },
  { name: "ShirtIcon", label: "Thời trang", Icon: ShirtIcon },
  { name: "DeviceIcon", label: "Thiết bị", Icon: DeviceIcon },
  { name: "HomeIcon", label: "Gia dụng", Icon: HomeIcon },
  { name: "SparklesIcon", label: "Làm đẹp / Khác", Icon: SparklesIcon },
] as const;

const GRADIENT_PRESETS = [
  {
    name: "Xanh Cyan - Indigo",
    value: "from-cyan-500 via-blue-500 to-indigo-600",
    badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    name: "Cam Hổ Phách - Rose",
    value: "from-amber-500 via-orange-500 to-rose-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    name: "Hồng - Fuchsia",
    value: "from-pink-500 via-rose-400 to-fuchsia-500",
    badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
  {
    name: "Xanh Dương - Sky",
    value: "from-blue-600 via-indigo-500 to-sky-400",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    name: "Xanh Lá - Emerald",
    value: "from-emerald-500 via-teal-500 to-cyan-500",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    name: "Tím - Violet",
    value: "from-purple-600 via-violet-500 to-indigo-500",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  initialCategory,
  existingCount,
}: Props) {
  const isEdit = Boolean(initialCategory);
  const { products, categoryProducts } = useProductData();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState<Category["iconName"]>("SparklesIcon");
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);

  // Selected product IDs in this category
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  useEffect(() => {
    if (initialCategory) {
      setId(initialCategory.id);
      setName(initialCategory.name);
      setSlug(initialCategory.slug);
      setDescription(initialCategory.description || "");
      setIconName(initialCategory.iconName || "SparklesIcon");

      const matchedGradIdx = GRADIENT_PRESETS.findIndex(
        (g) => g.value === initialCategory.bannerGradient
      );
      setSelectedGradientIndex(matchedGradIdx >= 0 ? matchedGradIdx : 0);

      // Load products currently mapped to this category
      const mappedIds = categoryProducts
        .filter((cp) => cp.categoryId.toLowerCase() === initialCategory.id.toLowerCase())
        .map((cp) => cp.productId);
      setSelectedProductIds(mappedIds);
    } else {
      const nextNum = String(existingCount + 1).padStart(2, "0");
      setId(`C-${nextNum}`);
      setName("");
      setSlug("");
      setDescription("");
      setIconName("SparklesIcon");
      setSelectedGradientIndex(0);
      setSelectedProductIds([]);
    }
    setIsPickerOpen(false);
    setPickerSearch("");
  }, [initialCategory, existingCount, isOpen, categoryProducts]);

  // Resolved list of assigned product objects
  const assignedProducts = useMemo(() => {
    const idSet = new Set(selectedProductIds);
    return products.filter((p) => idSet.has(p.id));
  }, [products, selectedProductIds]);

  // Unassigned products for picker modal
  const unassignedProducts = useMemo(() => {
    const idSet = new Set(selectedProductIds);
    const q = pickerSearch.toLowerCase().trim();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      return !idSet.has(p.id) && matchSearch;
    });
  }, [products, selectedProductIds, pickerSearch]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      setSlug(generateSlug(val));
    }
  };

  const handleToggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProductIds(selectedProductIds.filter((pId) => pId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    const currentGrad = GRADIENT_PRESETS[selectedGradientIndex] || GRADIENT_PRESETS[0];

    const categoryData: Category = {
      id: id.trim() || `C-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
      description: description.trim(),
      iconName,
      bannerGradient: currentGrad.value,
      badgeColor: currentGrad.badge,
      itemCountText: `${selectedProductIds.length} sản phẩm`,
      subcategories: initialCategory?.subcategories,
    };

    onSave(categoryData, selectedProductIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isEdit
                ? `Mã danh mục: ${id} • ${selectedProductIds.length} sản phẩm trực thuộc`
                : "Nhập thông tin nhóm ngành hàng sản phẩm"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body - 2 Columns */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT 1 (Bên trái): Thông tin cấu hình Danh mục */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  1. Thông Tin Danh Mục
                </span>
              </div>

              {/* Tên & Mã & Slug */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Mã danh mục (ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="VD: C-05"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white outline-none disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tên danh mục <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="VD: Chăm Sóc Da Mặt"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Đường dẫn tĩnh (Slug URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cham-soc-da-mat"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Mô tả ngắn gọn danh mục
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả công dụng và các dòng sản phẩm trong danh mục này..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Chọn Icon */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Biểu tượng đại diện (Icon)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {AVAILABLE_ICONS.map(({ name: iName, label, Icon }) => {
                    const isSelected = iconName === iName;
                    return (
                      <button
                        key={iName}
                        type="button"
                        onClick={() => setIconName(iName as Category["iconName"])}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <Icon className="h-5 w-5 mb-1" />
                        <span className="text-[10px] text-center leading-tight truncate w-full">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tông màu / Gradient */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Chủ đề màu sắc / Banner
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((preset, idx) => {
                    const isSelected = selectedGradientIndex === idx;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setSelectedGradientIndex(idx)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/30 font-semibold"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span
                          className={`h-5 w-5 rounded-lg bg-gradient-to-r ${preset.value} shrink-0 shadow-xs`}
                        />
                        <span className="text-[11px] text-zinc-800 dark:text-zinc-200 line-clamp-1">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CỘT 2 (Bên phải): Chỉnh sửa danh sách sản phẩm thuộc danh mục (mỗi hàng 3 sản phẩm) */}
            <div className="lg:col-span-6 space-y-3 bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    2. Sản Phẩm Thuộc Danh Mục
                  </span>
                  <span className="ml-2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 text-xs font-black">
                    {assignedProducts.length} SP
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  {isPickerOpen ? "Đóng danh sách thêm" : "Thêm SP vào DM"}
                </button>
              </div>

              {/* Picker Drawer/Box when user clicks "Thêm SP vào DM" */}
              {isPickerOpen && (
                <div className="p-3 bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-900 rounded-2xl shadow-sm space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      Chọn sản phẩm để gán vào danh mục #{id}:
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      ({unassignedProducts.length} SP có sẵn)
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm sản phẩm cần thêm..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 py-1.5 pl-8 pr-3 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                    <SearchIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {unassignedProducts.length === 0 ? (
                      <p className="text-xs text-zinc-400 py-3 text-center">
                        Không còn sản phẩm nào để thêm.
                      </p>
                    ) : (
                      unassignedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="pt-1.5 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                              #{p.id}
                            </span>
                            <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                              {p.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleProduct(p.id)}
                            className="rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-1 text-[11px] font-bold hover:bg-indigo-100 cursor-pointer shrink-0"
                          >
                            + Gán vào DM
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Grid 3 sản phẩm mỗi hàng */}
              <div className="max-h-[460px] overflow-y-auto pr-1">
                {assignedProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
                    <span className="text-2xl mb-2">📦</span>
                    <p className="text-xs font-medium">
                      Chưa có sản phẩm nào thuộc danh mục này.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
                    >
                      + Nhấn vào đây để thêm sản phẩm
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5">
                    {assignedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xs hover:shadow-xs transition-all"
                      >
                        {/* Remove Product from Category Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(p.id)}
                          className="absolute top-1 right-1 z-10 rounded-full bg-zinc-100 dark:bg-zinc-800 p-1 text-zinc-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                          title="Gỡ sản phẩm khỏi danh mục"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>

                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/60 p-1 mb-1.5">
                          {p.image ? (
                            <Image
                              src={getAssetPath(p.image)}
                              alt={p.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="h-full w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
                          )}
                          {p.tag && (
                            <span className="absolute top-1 left-1 rounded bg-zinc-900/90 dark:bg-zinc-100 text-white dark:text-zinc-950 px-1 py-0.2 text-[8px] font-bold">
                              {p.tag}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="font-mono text-[9px] font-semibold text-zinc-400 block">
                            #{p.id}
                          </span>
                          <h4 className="font-bold text-[10px] text-zinc-900 dark:text-white line-clamp-2 leading-tight">
                            {p.name}
                          </h4>
                          <span className="font-bold text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 block truncate">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-5 mt-6">
            <span className="text-xs text-zinc-400">
              Cấu trúc lưu: <code className="font-mono text-[11px] text-indigo-500">&#123; categoryId, productId &#125;</code>
            </span>

            <div className="flex items-center gap-3">
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
                {isEdit ? "Cập nhật danh mục & sản phẩm" : "Lưu danh mục mới"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
