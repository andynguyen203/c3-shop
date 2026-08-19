export interface ProductOrder {
  productId: string; // Mã sản phẩm (id)
  order: number;     // Thứ tự hiển thị (số càng nhỏ hiển thị càng trước, ví dụ: 1, 2, 3...)
}

/**
 * Cấu hình thứ tự hiển thị của các sản phẩm trong danh sách "Sản Phẩm Bán Chạy"
 * Định dạng: { productId: "mã sản phẩm", order: thứ_tự }
 */
export const FEATURED_PRODUCT_ORDER: ProductOrder[] = [
  { productId: "1", order: 2 }, // Viên Uống Tăng Chiều Cao GH Creation EX+ Nhật Bản
  { productId: "2", order: 3 }, // Kem Đánh Răng Trắng Răng Marvis Whitening Mint 85ml
  { productId: "3", order: 6 }, // Bọt Vệ Sinh Phụ Nữ Thảo Mộc Trầu Không & Hoa Cúc C3 Care
  { productId: "4", order: 5 }, // Nước Súc Miệng Diệt Khuẩn Không Cồn Listerine Cool Mint 750ml
  { productId: "5", order: 1 }, // Nước Nhỏ Mắt Giảm Mỏi & Sáng Mắt Sante FX Neo Nhật Bản 12ml
  { productId: "6", order: 4 }, // Thuốc Nhỏ Mắt Rohto Vita Nhật Bản
];

export const BEST_SELLER_ORDER = FEATURED_PRODUCT_ORDER;

