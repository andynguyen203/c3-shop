export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  imageBg: string; // Tailwind gradient background
  tag?: string;
  stock: number;
  specs?: Record<string, string>;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Áo Khoác Bomber Unisex",
    description: "Áo khoác bomber thời trang mang phong cách unisex năng động, chất liệu nỉ cotton dày dặn, ấm áp, thích hợp cho cả nam và nữ. Thiết kế form rộng trendy với bo thun cổ, cổ tay và gấu áo chắc chắn.",
    category: "Thời Trang",
    price: 450000,
    oldPrice: 600000,
    rating: 4.8,
    reviews: 124,
    imageBg: "from-pink-500 to-rose-400",
    tag: "Bán chạy",
    stock: 50,
    specs: {
      "Chất liệu": "Cotton Nỉ",
      "Kiểu dáng": "Form rộng Unisex",
      "Kích cỡ": "S, M, L, XL",
      "Màu sắc": "Đen, Xám, Xanh rêu"
    }
  },
  {
    id: "2",
    name: "Tai Nghe Không Dây Noise Cancelling",
    description: "Tai nghe chụp tai Bluetooth thế hệ mới tích hợp công nghệ chống ồn chủ động (ANC) vượt trội, âm thanh Hi-Fi sống động với driver 40mm, thời lượng pin sử dụng lên tới 40 giờ liên tục.",
    category: "Điện Tử",
    price: 1250000,
    oldPrice: 1800000,
    rating: 4.9,
    reviews: 86,
    imageBg: "from-blue-500 to-indigo-500",
    tag: "-30%",
    stock: 30,
    specs: {
      "Kết nối": "Bluetooth 5.3 & Jack 3.5mm",
      "Thời lượng pin": "Lên tới 40 giờ (tắt ANC)",
      "Trọng lượng": "250g",
      "Chống ồn": "Chống ồn chủ động ANC kỹ thuật số"
    }
  },
  {
    id: "3",
    name: "Bình Giữ Nhiệt Cao Cấp 1L",
    description: "Bình giữ nhiệt chất liệu inox 316 cao cấp chống gỉ, thiết kế 5 lớp giữ nóng lên đến 12 giờ và giữ lạnh lên đến 24 giờ. Nắp bình chống rò rỉ tuyệt đối, có quai xách tiện dụng cho các hoạt động thể thao dã ngoại.",
    category: "Gia Dụng",
    price: 299000,
    oldPrice: 350000,
    rating: 4.7,
    reviews: 245,
    imageBg: "from-teal-500 to-emerald-400",
    tag: "Mới",
    stock: 120,
    specs: {
      "Dung tích": "1000ml (1 Lít)",
      "Chất liệu": "Ruột Inox 316, vỏ Inox 304",
      "Khả năng giữ nhiệt": "Giữ nóng 12h, giữ lạnh 24h",
      "Tiện ích": "Có lưới lọc trà tháo rời"
    }
  },
  {
    id: "4",
    name: "Đồng Hồ Thông Minh Sport Lite",
    description: "Đồng hồ theo dõi sức khỏe và luyện tập thể thao thông minh, màn hình AMOLED 1.43 inch sắc nét, đo nhịp tim liên tục, nồng độ oxy trong máu SpO2, tích hợp hơn 100 chế độ tập luyện và chống nước 5ATM.",
    category: "Phụ Kiện",
    price: 890000,
    oldPrice: 1200000,
    rating: 4.6,
    reviews: 98,
    imageBg: "from-purple-500 to-violet-500",
    tag: "Hot",
    stock: 15,
    specs: {
      "Màn hình": "1.43 inch AMOLED, Always-On Display",
      "Chuẩn kháng nước": "5ATM (độ sâu 50m)",
      "Cảm biến": "Đo nhịp tim, SpO2, giấc ngủ, đếm bước chân",
      "Hệ điều hành tương thích": "Android 6.0+ & iOS 10.0+"
    }
  },
  {
    id: "5",
    name: "Bàn Phím Cơ Không Dây 75%",
    description: "Bàn phím cơ thiết kế layout 75% nhỏ gọn, hỗ trợ 3 chế độ kết nối (Bluetooth/2.4G/Type-C), Hotswap 5-pin, switch linear êm ái thích hợp cho cả gõ văn phòng lẫn chơi game. Đèn LED RGB 16.8 triệu màu tùy chỉnh.",
    category: "Điện Tử",
    price: 1550000,
    oldPrice: 1950000,
    rating: 4.8,
    reviews: 64,
    imageBg: "from-cyan-500 to-blue-600",
    stock: 25,
    specs: {
      "Layout": "82 phím (75%)",
      "Kết nối": "Type-C, Wireless 2.4G, Bluetooth 5.1",
      "Switch": "Linear Red Switch (Pre-lubed)",
      "Led": "RGB Backlit"
    }
  },
  {
    id: "6",
    name: "Giày Sneaker Run Pro",
    description: "Giày thể thao chạy bộ siêu nhẹ, đế giữa công nghệ Foam đàn hồi cực cao giúp giảm chấn tối đa cho gót chân, thân giày chất liệu dệt Primeknit thoáng khí, chống hầm bí tuyệt đối.",
    category: "Thời Trang",
    price: 780000,
    oldPrice: 950000,
    rating: 4.5,
    reviews: 112,
    imageBg: "from-orange-500 to-amber-500",
    tag: "Khuyên dùng",
    stock: 40,
    specs: {
      "Trọng lượng": "220g / chiếc (Size 41)",
      "Công nghệ đế": "E-TPU Boost Midsole",
      "Chất liệu thân": "Primeknit Mesh",
      "Size": "39, 40, 41, 42, 43"
    }
  },
  {
    id: "7",
    name: "Áo Thun Cotton Oversize Premium",
    description: "Áo thun form rộng tay lỡ phong cách đường phố, chất liệu 100% cotton định lượng 250gsm dày dặn, thấm hút mồ hôi tốt và không bai xù sau nhiều lần giặt.",
    category: "Thời Trang",
    price: 280000,
    oldPrice: 350000,
    rating: 4.9,
    reviews: 184,
    imageBg: "from-rose-500 to-pink-600",
    tag: "Bán chạy",
    stock: 85,
    specs: {
      "Chất liệu": "100% Cotton 250gsm",
      "Kiểu dáng": "Oversize Unisex",
      "Kích cỡ": "M, L, XL",
      "Màu sắc": "Trắng, Đen, Be, Xanh rêu"
    }
  },
  {
    id: "8",
    name: "Quần Jeans Slim-Fit Co Giãn",
    description: "Quần jeans nam nữ kiểu dáng ôm vừa vặn tôn dáng, công nghệ wash màu vintage bền đẹp, vải denim pha spandex co giãn 4 chiều vận động thoải mái.",
    category: "Thời Trang",
    price: 520000,
    oldPrice: 650000,
    rating: 4.7,
    reviews: 95,
    imageBg: "from-indigo-600 to-blue-500",
    stock: 35,
    specs: {
      "Chất liệu": "Denim 98% Cotton + 2% Spandex",
      "Kiểu dáng": "Slim-Fit",
      "Kích cỡ": "29, 30, 31, 32, 34"
    }
  },
  {
    id: "9",
    name: "Chuột Gaming Không Dây Ultra-Light",
    description: "Chuột gaming siêu nhẹ chỉ 55g, cảm biến quang học 26.000 DPI siêu chính xác, kết nối không dây 2.4GHz không độ trễ cùng thời lượng pin lên đến 80 giờ.",
    category: "Điện Tử",
    price: 890000,
    oldPrice: 1100000,
    rating: 4.8,
    reviews: 73,
    imageBg: "from-cyan-600 to-teal-500",
    tag: "Hot",
    stock: 20,
    specs: {
      "Trọng lượng": "55g siêu nhẹ",
      "Cảm biến": "PixArt PAW3395 (26,000 DPI)",
      "Kết nối": "Tri-mode (2.4G, Bluetooth, Type-C)",
      "Switch": "Optical Huano 80M clicks"
    }
  },
  {
    id: "10",
    name: "Loa Bluetooth Chống Nước IPX7",
    description: "Loa không dây di động công suất 30W với âm bass uy lực, chống nước tiêu chuẩn IPX7 chịu ngâm nước 1 mét trong 30 phút, pin 15 giờ liên tục.",
    category: "Điện Tử",
    price: 950000,
    oldPrice: 1300000,
    rating: 4.9,
    reviews: 142,
    imageBg: "from-blue-600 to-violet-600",
    tag: "-27%",
    stock: 45,
    specs: {
      "Công suất": "30W Stereo",
      "Kháng nước": "Chuẩn IPX7",
      "Thời lượng pin": "15 giờ",
      "Kết nối": "Bluetooth 5.3, AUX, Thẻ TF"
    }
  },
  {
    id: "11",
    name: "Nồi Chiên Không Dầu Điện Tử 6.5L",
    description: "Nồi chiên không dầu dung tích lớn 6.5L mặt kính trong suốt kèm đèn chiếu sáng, công nghệ nhiệt 360 độ giảm 85% dầu mỡ, 10 chế độ nấu tự động cài sẵn.",
    category: "Gia Dụng",
    price: 1650000,
    oldPrice: 2200000,
    rating: 4.8,
    reviews: 310,
    imageBg: "from-emerald-600 to-green-500",
    tag: "Bán chạy",
    stock: 18,
    specs: {
      "Dung tích": "6.5 Lít",
      "Công suất": "1800W",
      "Bảng điều khiển": "Cảm ứng LED thông minh",
      "Lòng nồi": "Chống dính Ceramic cao cấp"
    }
  },
  {
    id: "12",
    name: "Đèn Bàn LED Bảo Vệ Thị Lực",
    description: "Đèn học và làm việc chống cận thị với chỉ số hoàn màu CRI > 95, điều chỉnh 5 mức độ sáng và 3 nhiệt độ màu, tích hợp cổng sạc nhanh Type-C và sạc không dây.",
    category: "Gia Dụng",
    price: 450000,
    oldPrice: 580000,
    rating: 4.7,
    reviews: 158,
    imageBg: "from-teal-600 to-cyan-600",
    stock: 60,
    specs: {
      "Độ sáng": "Tối đa 1000 Lux",
      "Chỉ số hoàn màu": "Ra > 95 (chuẩn ánh sáng tự nhiên)",
      "Tính năng": "Cảm ứng trượt, hẹn giờ tắt 45 phút"
    }
  },
  {
    id: "13",
    name: "Kính Mát Polarized Chống UV400",
    description: "Kính râm thời trang gọng hợp kim titan siêu nhẹ, tròng phân cực Polarized ngăn chặn 100% tia cực tím UVA/UVB và chống lóa khi đi nắng hoặc lái xe.",
    category: "Phụ Kiện",
    price: 390000,
    oldPrice: 550000,
    rating: 4.7,
    reviews: 88,
    imageBg: "from-purple-600 to-indigo-600",
    tag: "Mới",
    stock: 50,
    specs: {
      "Chất liệu gọng": "Hợp kim Titan B-Titanium",
      "Tròng kính": "Polarized TAC 9 lớp",
      "Chống UV": "UV400 Category 3"
    }
  },
  {
    id: "14",
    name: "Balo Laptop Chống Nước 15.6 Inch",
    description: "Balo công sở và du lịch chất liệu vải Oxford 900D chống thấm nước, ngăn chống sốc chuyên dụng cho laptop 15.6 inch, cổng sạc USB tích hợp tiện lợi.",
    category: "Phụ Kiện",
    price: 480000,
    oldPrice: 620000,
    rating: 4.8,
    reviews: 215,
    imageBg: "from-fuchsia-600 to-pink-500",
    tag: "Hot",
    stock: 70,
    specs: {
      "Kích thước": "45 x 30 x 14 cm",
      "Tương thích": "Laptop 15.6 inch + iPad 11 inch",
      "Chất liệu": "Vải Oxford 900D chống thấm"
    }
  }
];
