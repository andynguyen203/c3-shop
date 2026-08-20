"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProductData } from "@/context/ProductDataContext";
import CategoryManagement from "./components/CategoryManagement";
import ProductManagement from "./components/ProductManagement";
import FeaturedManagement from "./components/FeaturedManagement";

type AdminTab = "categories" | "products" | "featured";

const AUTH_STORAGE_KEY = "japan_shop_admin_authenticated_v1";
const ADMIN_PASSKEY = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || "japan2024";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  const { categories, products, getFeaturedProducts } = useProductData();

  // Check authentication status on mount
  useEffect(() => {
    try {
      const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      const localAuth = localStorage.getItem(AUTH_STORAGE_KEY);

      if (sessionAuth === "true" || localAuth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const inputTrimmed = passkeyInput.trim();

    if (!inputTrimmed) {
      setErrorMsg("Vui lòng nhập mã passkey quản trị!");
      return;
    }

    if (inputTrimmed === ADMIN_PASSKEY) {
      setIsAuthenticated(true);
      try {
        if (rememberDevice) {
          localStorage.setItem(AUTH_STORAGE_KEY, "true");
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        }
      } catch {
        // Storage fallback
      }
    } else {
      setErrorMsg("Mã passkey không chính xác! Vui lòng thử lại.");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Storage fallback
    }
    setIsAuthenticated(false);
    setPasskeyInput("");
    setErrorMsg("");
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  // Passkey Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl">
          {/* Lock Icon Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 shadow-inner mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Bảo Mật Quản Trị
            </h2>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              Vui lòng nhập mã Passkey để truy cập bảng quản lý Japan Shop
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Mã Passkey Admin
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? "text" : "password"}
                  autoFocus
                  required
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Nhập mã passkey..."
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  {showPasskey ? "🙈 Ẩn" : "👁 Hiện"}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in duration-200">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Ghi nhớ phiên đăng nhập</span>
              </label>

              <Link
                href="/"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Về trang chủ
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer mt-2"
            >
              🔓 Xác nhận mở khóa
            </button>
          </form>
        </div>
      </div>
    );
  }

  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Bar Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <span>Hệ thống Quản trị Cửa hàng</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Trang Quản Trị Japan Shop
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Quản lý phân loại danh mục, kho sản phẩm và vị trí hiển thị sản phẩm bán chạy
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
            >
              👁 Xem cửa hàng
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 px-3.5 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors cursor-pointer"
              title="Khóa và đăng xuất khỏi trang admin"
            >
              🔒 Khóa / Đăng xuất
            </button>
          </div>
        </div>

        {/* 3 Main Screens Navigation Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 gap-1.5 min-w-full sm:min-w-0">
            {/* Tab 1: Categories */}
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "categories"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>🏷️ 1. Quản lý Danh mục</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "categories"
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {categories.length}
              </span>
            </button>

            {/* Tab 2: Products */}
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>📦 2. Quản lý Sản phẩm</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "products"
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {products.length}
              </span>
            </button>

            {/* Tab 3: Featured Products */}
            <button
              onClick={() => setActiveTab("featured")}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "featured"
                  ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-md scale-[1.02]"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>🔥 3. Quản lý Sản phẩm Bán chạy</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "featured"
                    ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {featuredProducts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Screen Content */}
        <div>
          {activeTab === "categories" && <CategoryManagement />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "featured" && <FeaturedManagement />}
        </div>
      </div>
    </div>
  );
}
