import { CATEGORIES, Category } from "@/data/categories";
import { PRODUCTS, Product } from "@/data/products";

export interface CategoryStats {
  totalProducts: number;
  minPrice: number;
  maxPrice: number;
  avgRating: number;
  totalReviews: number;
}

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const categoryService = {
  /**
   * Lấy danh sách toàn bộ danh mục
   */
  getAllCategories(): Category[] {
    return CATEGORIES;
  },

  /**
   * Lấy chi tiết danh mục theo slug (ví dụ: "thoi-trang", "dien-tu")
   */
  getCategoryBySlug(slug: string): Category | undefined {
    if (!slug) return undefined;
    const targetSlug = normalize(slug);
    return CATEGORIES.find(
      (cat) => normalize(cat.slug) === targetSlug || normalize(cat.id) === targetSlug
    );
  },

  /**
   * Lấy chi tiết danh mục theo ID
   */
  getCategoryById(id: string): Category | undefined {
    return CATEGORIES.find((cat) => cat.id === id);
  },

  /**
   * Lấy chi tiết danh mục theo tên (ví dụ: "Thời Trang")
   */
  getCategoryByName(name: string): Category | undefined {
    if (!name) return undefined;
    const targetName = normalize(name);
    return CATEGORIES.find((cat) => normalize(cat.name) === targetName);
  },

  /**
   * Lấy danh sách sản phẩm thuộc danh mục dựa theo category slug
   */
  getProductsByCategorySlug(slug: string): Product[] {
    const category = this.getCategoryBySlug(slug);
    if (!category) return [];

    const targetCategoryName = normalize(category.name);
    return PRODUCTS.filter(
      (p) => p.categoryId === category.id || normalize(p.category || "") === targetCategoryName
    );
  },

  /**
   * Tính toán thống kê cho danh mục (số lượng, giá thấp nhất, giá cao nhất, rating trung bình)
   */
  getCategoryStats(slug: string): CategoryStats {
    const products = this.getProductsByCategorySlug(slug);
    if (products.length === 0) {
      return {
        totalProducts: 0,
        minPrice: 0,
        maxPrice: 0,
        avgRating: 0,
        totalReviews: 0
      };
    }

    const prices = products.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalReviews = products.reduce((acc, p) => acc + p.reviews, 0);
    const avgRating = Number(
      (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
    );

    return {
      totalProducts: products.length,
      minPrice,
      maxPrice,
      avgRating,
      totalReviews
    };
  }
};
