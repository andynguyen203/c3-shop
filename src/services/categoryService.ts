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
   * Lấy chi tiết danh mục theo ID (ví dụ: "C-01", "c-01", "1")
   */
  getCategoryById(id: string): Category | undefined {
    if (!id) return undefined;
    const targetId = id.trim().toLowerCase();
    const targetNum = normalizeId(id);

    const direct = CATEGORIES.find(
      (cat) =>
        cat.id.toLowerCase() === targetId ||
        normalizeId(cat.id) === targetNum ||
        normalize(cat.name) === normalize(id)
    );
    if (direct) return direct;

    // Fallback alias matching
    const targetSlug = normalize(id);
    if (targetSlug.includes("me") && targetSlug.includes("be")) {
      return CATEGORIES.find((c) => c.id === "C-03");
    }
    if (targetSlug.includes("mat")) {
      return CATEGORIES.find((c) => c.id === "C-04");
    }
    if (
      targetSlug.includes("ca-nhan") ||
      targetSlug.includes("personal") ||
      targetSlug.includes("rang") ||
      targetSlug.includes("mieng")
    ) {
      return CATEGORIES.find((c) => c.id === "C-01");
    }
    if (
      targetSlug.includes("thuc-pham") ||
      targetSlug.includes("bo-sung") ||
      targetSlug.includes("tpcn") ||
      targetSlug.includes("chuc-nang")
    ) {
      return CATEGORIES.find((c) => c.id === "C-02");
    }

    return undefined;
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
  getCategoryStats(categoryIdInput: string): CategoryStats {
    const category = this.getCategoryById(categoryIdInput);
    const categoryId = category ? category.id : categoryIdInput;
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
