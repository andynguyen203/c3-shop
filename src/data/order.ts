export interface ProductOrder {
  productId: string; // Mã sản phẩm (id)
  order: number;     // Thứ tự hiển thị (số càng nhỏ hiển thị càng trước, ví dụ: 1, 2, 3...)
}

/**
 * Cấu hình thứ tự hiển thị của các sản phẩm trong danh sách "Sản Phẩm Bán Chạy"
 * Định dạng: { productId: "mã sản phẩm", order: thứ_tự }
 */
export const FEATURED_PRODUCT_ORDER: ProductOrder[] = [
  { productId: "11", order: 1 }, // Trị muỗi Muhi S2a 50ml
  { productId: "1", order: 2 },  // Nước rửa mắt Eyebon W Premium 500ml
  { productId: "12", order: 3 }, // Kem chống nắng KISSME Mommy! Aqua Milk 50g
  { productId: "16", order: 4 }, // Xịt chống muỗi SKIN VAPE MIST 200ml
  { productId: "22", order: 5 }, // Bột canxi FINE JAPAN Socola 140 g
  { productId: "25", order: 6 }, // Viên uống Axit Folic + Canxi Pigeon 60 viên
  { productId: "3", order: 7 },  // Nước Nhỏ Mắt Nhật Bản Sante Fx Neo 12ml
  { productId: "20", order: 8 }, // Siro ho Pabron Kids 120ml
  { productId: "21", order: 9 }, // Kem đánh răng Pigeon Petit Kids 50g
  { productId: "4", order: 10 }, // Nước nhỏ mắt Santen PC 12ml
  { productId: "2", order: 11 }, // Nước nhỏ mắt Rohto 40α 12ml
  { productId: "26", order: 12 },// Viên uống Axit Folic Mamaru
  { productId: "27", order: 13 },// Viên uống Axit Folic DHC
  { productId: "30", order: 14 },// Kẹo dẻo UHA Kids Canxi + Sắt
];

export const BEST_SELLER_ORDER = FEATURED_PRODUCT_ORDER;


