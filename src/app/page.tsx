import Link from "next/link";
import { categoryService } from "@/services/categoryService";
import {
  PillIcon,
  ToothIcon,
  HeartIcon,
  DropIcon,
  EyeIcon,
  ShirtIcon,
  DeviceIcon,
  HomeIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "@/components/icons";
import FeaturedProductsSection from "@/components/features/FeaturedProductsSection";

const renderCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "PillIcon":
      return <PillIcon className="h-6 w-6" />;
    case "ToothIcon":
      return <ToothIcon className="h-6 w-6" />;
    case "HeartIcon":
      return <HeartIcon className="h-6 w-6" />;
    case "DropIcon":
      return <DropIcon className="h-6 w-6" />;
    case "EyeIcon":
      return <EyeIcon className="h-6 w-6" />;
    case "ShirtIcon":
      return <ShirtIcon className="h-6 w-6" />;
    case "DeviceIcon":
      return <DeviceIcon className="h-6 w-6" />;
    case "HomeIcon":
      return <HomeIcon className="h-6 w-6" />;
    case "SparklesIcon":
      return <SparklesIcon className="h-6 w-6" />;
    default:
      return <SparklesIcon className="h-6 w-6" />;
  }
};

export default function Home() {
  const categories = categoryService.getAllCategories();

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      {/* Category Section */}
      <section className="py-12 sm:py-16 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Khám Phá Theo Danh Mục
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Lựa chọn sản phẩm theo từng nhóm ngành hàng
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                <div
                  className={`absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-gradient-to-br ${cat.bannerGradient} opacity-15 group-hover:scale-150 transition-transform duration-500`}
                />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-xs mb-4">
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400">
                      {cat.itemCountText}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Xem ngay <ChevronRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProductsSection />

      {/* CTA Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-zinc-900 dark:bg-zinc-900 px-6 py-20 shadow-2xl rounded-3xl sm:px-12 md:py-24 lg:flex lg:items-center lg:gap-x-20 lg:px-24">
            <div className="mx-auto max-w-md lg:mx-0 lg:flex-auto">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Đăng ký nhận tin. <br />Nhận ngay ưu đãi 10%.
              </h2>
              <p className="mt-6 text-lg leading-8 text-zinc-300">
                Đừng bỏ lỡ các đợt giảm giá lớn, bộ sưu tập giới hạn và mẹo mua sắm độc quyền từ chúng tôi.
              </p>
              <form className="mt-10 flex max-w-md gap-x-4">
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn"
                  className="min-w-0 flex-auto rounded-full border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  className="flex-none rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

