import rawOrders from "./order.json";
import rawAlterOrders from "./alter-order.json";

export interface ProductOrder {
  productId: string; // Mã sản phẩm (id)
  order: number;     // Thứ tự hiển thị (số càng nhỏ hiển thị càng trước, ví dụ: 1, 2, 3...)
}

const alterOrders = rawAlterOrders as ProductOrder[];
const baseOrders = rawOrders as ProductOrder[];

export const FEATURED_PRODUCT_ORDER: ProductOrder[] =
  Array.isArray(alterOrders) && alterOrders.length > 0
    ? alterOrders
    : baseOrders;

export const BEST_SELLER_ORDER = FEATURED_PRODUCT_ORDER;




