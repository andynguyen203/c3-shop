import { PRODUCTS, Product } from "@/data/products";
import { FEATURED_PRODUCT_ORDER } from "@/data/order";

const normalizeId = (id: string) =>
  id
    .toLowerCase()
    .trim()
    .replace(/^c-0?/, "")
    .replace(/^0+/, "");

export const productService = {
  /**
   * Lấy danh sách toàn bộ sản phẩm
   */
  getAllProducts(): Product[] {
    return PRODUCTS;
  },

  /**
   * Lấy thông tin chi tiết một sản phẩm theo ID
   */
  getProductById(id: string): Product | undefined {
    return PRODUCTS.find(
      (product) => product.id === id || product.id.toLowerCase() === id.toLowerCase()
    );
  },

  /**
   * Lấy danh sách sản phẩm theo Category ID
   */
  getProductsByCategoryId(categoryId: string): Product[] {
    if (!categoryId) return [];
    const targetId = categoryId.trim().toLowerCase();
    const targetNum = normalizeId(categoryId);

    return PRODUCTS.filter(
      (product) =>
        product.categoryId.toLowerCase() === targetId ||
        normalizeId(product.categoryId) === targetNum
    );
  },

  /**
   * Lấy danh sách sản phẩm theo danh mục (categoryId)
   */
  getProductsByCategory(categoryId: string): Product[] {
    return this.getProductsByCategoryId(categoryId);
  },

  /**
   * Lấy danh sách sản phẩm bán chạy / nổi bật theo thứ tự cấu hình trong data/order.ts
   */
  getFeaturedProducts(limit?: number): Product[] {
    const orderMap = new Map<string, number>(
      FEATURED_PRODUCT_ORDER.map((item) => [item.productId, item.order])
    );

    const featured = [...PRODUCTS]
      .filter((product) => product.tag !== undefined || product.rating >= 4.7)
      .sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;

        return orderA - orderB;
      });

    return limit ? featured.slice(0, limit) : featured;
  },

  /**
   * Tìm kiếm sản phẩm theo tên hoặc mô tả
   */
  searchProducts(query: string): Product[] {
    if (!query || !query.trim()) return [];

    const normalize = (str: string) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const searchTarget = normalize(query);
    return PRODUCTS.filter(
      (product) =>
        normalize(product.name).includes(searchTarget) ||
        normalize(product.description).includes(searchTarget)
    );
  }
};
