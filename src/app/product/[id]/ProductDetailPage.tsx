"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import CartIcon from "@/components/icons/CartIcon";
import StarIcon from "@/components/icons/StarIcon";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import BoltIcon from "@/components/icons/BoltIcon";
import Breadcrumb from "@/components/Breadcrumb";
import { categoryService } from "@/services/categoryService";
import { getAssetPath } from "@/utils/assetPath";
import { useProductData } from "@/context/ProductDataContext";

const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN") + "đ";

const calcDiscount = (price: number, oldPrice: number) =>
  Math.round(((oldPrice - price) / oldPrice) * 100);

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailPage({ product, related }: Props) {
  const { getProductById, getProductsByCategoryId, isLoaded } = useProductData();

  const currentProduct =
    (isLoaded ? getProductById(product.id) : null) || product;

  const currentRelated =
    (isLoaded
      ? getProductsByCategoryId(currentProduct.categoryId)
          .filter((p) => p.id !== currentProduct.id)
          .slice(0, 4)
      : null) || related;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs">("desc");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount =
    currentProduct.oldPrice && currentProduct.oldPrice > currentProduct.price
      ? calcDiscount(currentProduct.price, currentProduct.oldPrice)
      : null;

  const category = categoryService.getCategoryById(currentProduct.categoryId);
  const categoryName = category ? category.name : "Sản phẩm";
  const categoryHref = category ? `/category/${category.slug}` : "/";

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: categoryName, href: categoryHref },
            { label: currentProduct.name },
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div
              className="relative w-full aspect-square rounded-3xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xl border border-zinc-200/60 dark:border-zinc-800 p-4 sm:p-6 flex items-center justify-center"
            >
              {currentProduct.image ? (
                <Image
                  src={getAssetPath(currentProduct.image)}
                  alt={currentProduct.name}
                  fill
                  priority
                  className="object-contain p-2 sm:p-4 transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl tracking-wide bg-black/20 backdrop-blur-md px-8 py-4 rounded-2xl">
                    {categoryName}
                  </span>
                </div>
              )}
              {currentProduct.tag && (
                <span className="absolute top-5 left-5 rounded-full bg-zinc-900/90 dark:bg-zinc-50/90 text-white dark:text-zinc-950 px-3 py-1.5 text-sm font-semibold shadow-md z-10">
                  {currentProduct.tag}
                </span>
              )}
              {discount && (
                <span className="absolute top-5 right-5 rounded-full bg-rose-600 text-white px-3 py-1.5 text-sm font-bold shadow-md z-10">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Category & Name */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {categoryName}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                {currentProduct.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(currentProduct.rating)
                        ? "text-amber-400"
                        : i < currentProduct.rating
                        ? "text-amber-300"
                        : "text-zinc-300 dark:text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {currentProduct.rating}
              </span>
              <span className="text-sm text-zinc-400">
                ({currentProduct.reviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                {formatPrice(currentProduct.price)}
              </span>
              {currentProduct.oldPrice && currentProduct.oldPrice > currentProduct.price && (
                <div className="flex flex-col items-start">
                  <span className="text-lg text-zinc-400 line-through">
                    {formatPrice(currentProduct.oldPrice)}
                  </span>
                  <span className="text-sm font-semibold text-rose-500">
                    Tiết kiệm {formatPrice(currentProduct.oldPrice - currentProduct.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200 dark:border-zinc-800" />

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Số lượng
              </label>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-l-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="h-10 w-14 flex items-center justify-center border-t border-b border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(currentProduct.stock, q + 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-r-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  added
                    ? "bg-green-600 text-white"
                    : currentProduct.stock === 0
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95"
                }`}
              >
                {added ? (
                  <>
                    <CheckIcon className="h-5 w-5" />
                    Đã thêm vào giỏ!
                  </>
                ) : (
                  <>
                    <CartIcon className="h-5 w-5" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </button>
              <button
                disabled={currentProduct.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BoltIcon className="h-5 w-5" />
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        {/* Tabs: Description & Specs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 mb-8">
            {(["desc", "specs"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold transition-colors cursor-pointer rounded-t-lg ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {tab === "desc" ? "Mô tả sản phẩm" : "Thông số kỹ thuật"}
              </button>
            ))}
          </div>

          {activeTab === "desc" && (
            <div className="">
              <p className="text-base leading-8 text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                {currentProduct.description}
              </p>
            </div>
          )}

          {activeTab === "specs" && currentProduct.specs && (
            <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(currentProduct.specs).map(([key, value], index) => (
                    <tr
                      key={key}
                      className={
                        index % 2 === 0
                          ? "bg-zinc-50 dark:bg-zinc-900"
                          : "bg-white dark:bg-zinc-950"
                      }
                    >
                      <td className="py-3.5 px-5 font-semibold text-zinc-700 dark:text-zinc-300 w-1/4 sm:w-1/5 align-top border-r border-zinc-200 dark:border-zinc-800">
                        {key}
                      </td>
                      <td className="py-3.5 px-5 text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed align-top">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "specs" && !currentProduct.specs && (
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">Không có thông số kỹ thuật.</p>
          )}
        </div>

        {/* Related Products */}
        {currentRelated.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {currentRelated.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-2">
                    {p.image && (
                      <Image
                        src={getAssetPath(p.image)}
                        alt={p.name}
                        fill
                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/25 z-10">
                      <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        Xem chi tiết
                      </span>
                    </div>
                    {p.tag && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-zinc-900/90 text-white px-2 py-0.5 text-[11px] font-semibold z-10">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        {formatPrice(p.price)}
                      </span>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="text-xs text-zinc-400 line-through">
                          {formatPrice(p.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
