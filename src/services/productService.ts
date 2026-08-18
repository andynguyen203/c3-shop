import { PRODUCTS, Product } from "@/data/products";

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
    return PRODUCTS.filter((product) => product.categoryId === categoryId);
  },

  /**
   * Lấy danh sách sản phẩm theo danh mục (hỗ trợ categoryId, tên hoặc alias)
   */
  getProductsByCategory(category: string): Product[] {
    const normalize = (str: string) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const targetCategory = normalize(category);
    return PRODUCTS.filter(
      (product) =>
        product.categoryId === category ||
        normalize(product.categoryId) === targetCategory ||
        (product.category && normalize(product.category) === targetCategory)
    );
  },

  /**
   * Lấy danh sách sản phẩm nổi bật (có gắn tag hoặc rating cao >= 4.7)
   */
  getFeaturedProducts(limit?: number): Product[] {
    const featured = PRODUCTS.filter(
      (product) => product.tag !== undefined || product.rating >= 4.7
    );
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
