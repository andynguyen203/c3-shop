import rawOrders from "./order.json";

export interface ProductOrder {
  productId: string; // Mã sản phẩm (id)
  order: number;     // Thứ tự hiển thị (số càng nhỏ hiển thị càng trước, ví dụ: 1, 2, 3...)
}

/**
 * Cấu hình thứ tự hiển thị của các sản phẩm trong danh sách "Sản Phẩm Bán Chạy"
 */
export const FEATURED_PRODUCT_ORDER: ProductOrder[] = rawOrders as ProductOrder[];

export const BEST_SELLER_ORDER = FEATURED_PRODUCT_ORDER;



