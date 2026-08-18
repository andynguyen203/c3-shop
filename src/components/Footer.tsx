import Link from "next/link";
import BagIcon from "./icons/BagIcon";
import LocationIcon from "./icons/LocationIcon";
import PhoneIcon from "./icons/PhoneIcon";
import MailIcon from "./icons/MailIcon";
import { categoryService } from "@/services/categoryService";

export default function Footer() {
  const categories = categoryService.getAllCategories();

  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Logo & Intro */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white mb-4">
              <BagIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span>MyShop</span>
            </Link>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400 leading-6">
              Chúng tôi cung cấp các sản phẩm chất lượng cao với dịch vụ khách hàng tốt nhất. Trải nghiệm mua sắm tuyệt vời cùng MyShop.
            </p>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Danh mục
            </h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/category/${item.slug}`}
                    className="text-sm text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span>123 Đường Láng, Đống Đa, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 shrink-0 text-zinc-400" />
                <span>0987.654.321</span>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 shrink-0 text-zinc-400" />
                <span>contact@myshop.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          <p>© {new Date().getFullYear()} MyShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
