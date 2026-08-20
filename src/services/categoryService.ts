import { CATEGORIES, Category } from "@/data/categories";
import { PRODUCTS, Product } from "@/data/products";
import { CATEGORY_PRODUCTS } from "@/data/categoryProducts";

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

const normalizeId = (id: string) =>
  id
    .toLowerCase()
    .trim()
    .replace(/^c-0?/, "")
    .replace(/^0+/, "");

export const categoryService = {
  /**
   * Lấy danh sách toàn bộ danh mục
   */
  getAllCategories(): Category[] {
    return CATEGORIES;
  },

  /**
   * Lấy chi tiết danh mục theo slug (ví dụ: "thoi-trang", "cham-soc-rang-mieng")
   */
  getCategoryBySlug(slug: string): Category | undefined {
    if (!slug) return undefined;
    const targetSlug = normalize(slug);
    return CATEGORIES.find(
      (cat) =>
        normalize(cat.slug) === targetSlug ||
        normalize(cat.id) === targetSlug ||
        normalizeId(cat.id) === normalizeId(slug)
    );
  },

  /**
   * Lấy chi tiết danh mục theo ID
   */
  getCategoryById(id: string): Category | undefined {
    if (!id) return undefined;
    const targetId = id.trim().toLowerCase();
    const targetNum = normalizeId(id);
    return CATEGORIES.find(
      (cat) =>
        cat.id.toLowerCase() === targetId ||
        normalizeId(cat.id) === targetNum ||
        normalize(cat.slug) === normalize(id)
    );
  },

  /**
   * Lấy chi tiết danh mục theo tên (ví dụ: "Chăm Sóc Răng Miệng")
   */
  getCategoryByName(name: string): Category | undefined {
    if (!name) return undefined;
    const targetName = normalize(name);
    return CATEGORIES.find((cat) => normalize(cat.name) === targetName);
  },

  /**
   * Lấy danh sách sản phẩm thuộc danh mục dựa theo Category ID
   */
  getProductsByCategoryId(categoryId: string): Product[] {
    if (!categoryId) return [];
    const targetId = categoryId.trim().toLowerCase();
    const targetNum = normalizeId(categoryId);

    const matchedProductIds = new Set(
      CATEGORY_PRODUCTS.filter(
        (cp) =>
          cp.categoryId.toLowerCase() === targetId ||
          normalizeId(cp.categoryId) === targetNum
      ).map((cp) => cp.productId)
    );

    return PRODUCTS.filter((p) => matchedProductIds.has(p.id));
  },

  /**
   * Tính toán thống kê cho danh mục (số lượng, giá thấp nhất, giá cao nhất, rating trung bình)
   */
  getCategoryStats(categoryIdOrSlug: string): CategoryStats {
    const category =
      this.getCategoryById(categoryIdOrSlug) ||
      this.getCategoryBySlug(categoryIdOrSlug);
    const categoryId = category ? category.id : categoryIdOrSlug;
    const products = this.getProductsByCategoryId(categoryId);

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
