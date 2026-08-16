"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import SunIcon from "@/components/icons/SunIcon";
import MoonIcon from "@/components/icons/MoonIcon";
import SearchIcon from "./icons/SearchIcon";
import CartIcon from "./icons/CartIcon";
import BagIcon from "./icons/BagIcon";
import MenuIcon from "./icons/MenuIcon";
import CloseIcon from "./icons/CloseIcon";
import { categoryService } from "@/services/categoryService";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = categoryService.getAllCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Đang tìm kiếm: ${searchQuery}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            <BagIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>MyShop</span>
          </Link>

          {/* Desktop Navigation Categories */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/${category.slug}`}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side items: Search, Cart, Theme Toggle & Mobile menu */}
        <div className="flex items-center gap-4">
          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex relative max-w-xs items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 lg:w-64 rounded-full border border-zinc-200 bg-zinc-50 py-1.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-indigo-400 dark:focus:bg-zinc-950"
            />
            <button
              type="submit"
              className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>

          {/* Cart Icon */}
          <button className="relative p-2 text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 cursor-pointer">
            <CartIcon className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              0
            </span>
          </button>

          {/* Theme Toggle Button */}
          {mounted ? (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-700 hover:text-indigo-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-indigo-400 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              aria-label="Chuyển đổi giao diện"
            >
              {theme === "light" ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 md:hidden cursor-pointer"
          >
            {isMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-3 flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-1.5 pl-4 pr-10 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900"
            />
            <button type="submit" className="absolute right-3 text-zinc-400">
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/${category.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
