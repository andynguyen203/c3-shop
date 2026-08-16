import Link from "next/link";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import ShirtIcon from "@/components/icons/ShirtIcon";
import DeviceIcon from "@/components/icons/DeviceIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import SparklesIcon from "@/components/icons/SparklesIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import StarIcon from "@/components/icons/StarIcon";
import PlusIcon from "@/components/icons/PlusIcon";

const formatPrice = (price: number) => {
  return price.toLocaleString("vi-VN") + "đ";
};

const renderCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "ShirtIcon":
      return <ShirtIcon className="h-6 w-6" />;
    case "DeviceIcon":
      return <DeviceIcon className="h-6 w-6" />;
    case "HomeIcon":
      return <HomeIcon className="h-6 w-6" />;
    case "SparklesIcon":
      return <SparklesIcon className="h-6 w-6" />;
    default:
      return <ShirtIcon className="h-6 w-6" />;
  }
};

export default function Home() {
  const categories = categoryService.getAllCategories();
  const featuredProducts = productService.getFeaturedProducts(4);

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
                href={`/${cat.slug}`}
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
      <section className="bg-white py-16 dark:bg-zinc-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Sản Phẩm Đang Hot</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Được mua nhiều nhất tuần này</p>
            </div>
            <Link
              href="/san-pham"
              className="mt-4 sm:mt-0 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              Xem tất cả sản phẩm
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.imageBg} opacity-85 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm tracking-wide bg-black/25 backdrop-blur-md px-4 py-2 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    {product.tag && (
                      <span className="absolute top-3 left-3 rounded-full bg-zinc-900/90 dark:bg-zinc-50/90 text-white dark:text-zinc-950 px-2.5 py-1 text-xs font-semibold">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        <Link href={`/product/${product.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-amber-500">
                        <StarIcon className="h-4 w-4 fill-current" />
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{product.rating}</span>
                        <span className="text-zinc-400">({product.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between z-10">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 line-through">
                      {product.oldPrice ? formatPrice(product.oldPrice) : "\u00A0"}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 p-2 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

