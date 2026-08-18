export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string; // "C-01", "C-02", "C-03", "C-04"
  image: string; // "/images/C-01-01.jpg"
  imageBg?: string; // Tailwind gradient background
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  tag?: string;
  stock: number;
  specs?: Record<string, string>;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Viên Uống Tăng Chiều Cao GH Creation EX+ Nhật Bản",
    description: "Viên uống tăng chiều cao thế hệ mới bổ sung hợp chất α-GPC, Arginine và Bone Peptide thúc đẩy tuyến yên sản sinh hormone tăng trưởng tự nhiên GH. Hỗ trợ phát triển hệ xương khớp vững chắc cho độ tuổi 10 - 30 tuổi.",
    categoryId: "C-02",
    image: "/images/C-02-01.jpg",
    imageBg: "from-amber-500 to-orange-500",
    price: 680000,
    oldPrice: 850000,
    rating: 4.9,
    reviews: 312,
    tag: "Bán chạy nhất",
    stock: 85,
    specs: {
      "Xuất xứ": "Nhật Bản (Eternal Co., Ltd)",
      "Quy cách": "Hộp 270 viên",
      "Độ tuổi phù hợp": "10 - 30 tuổi",
      "Thành phần chính": "α-GPC, Arginine, Bone Peptide, Canxi San hô Coral Calcium",
      "Liều lượng": "3 viên mỗi ngày trước khi đi ngủ"
    }
  },
  {
    id: "2",
    name: "Kem Đánh Răng Trắng Răng Marvis Whitening Mint 85ml",
    description: "Dòng kem đánh răng cao cấp phong cách quý tộc Ý với công thức làm trắng răng tự nhiên, tẩy sạch mảng bám cà phê, trà thuốc lá mà không gây mòn men răng. Hương bạc hà the mát lưu hương sang trọng.",
    categoryId: "C-01",
    image: "/images/C-01-01.jpg",
    imageBg: "from-cyan-500 to-blue-600",
    tag: "Hot",
    price: 285000,
    oldPrice: 350000,
    rating: 4.9,
    reviews: 428,
    stock: 110,
    specs: {
      "Xuất xứ": "Florence, Ý",
      "Dung tích": "Tuýp 85ml",
      "Hương vị": "Bạc hà lạnh Whitening Mint",
      "Công dụng": "Làm trắng sáng răng, loại bỏ mảng bám ố vàng, thơm miệng",
      "Loại răng": "Phù hợp mọi loại men răng"
    }
  },
  {
    id: "3",
    name: "Bọt Vệ Sinh Phụ Nữ Thảo Mộc Trầu Không & Hoa Cúc C3 Care",
    description: "Bọt vệ sinh thế hệ mới tạo bọt mịn tức thì không cần ma sát, chiết xuất dịch chiết trầu không chuẩn hóa, Cúc La Mã và Nano Bạc giúp kháng khuẩn, cân bằng pH 3.8 - 4.2 và khử mùi suốt 24 giờ.",
    categoryId: "C-03",
    image: "/images/C-03-01.jpg",
    imageBg: "from-pink-500 to-rose-500",
    tag: "Khuyên dùng",
    price: 195000,
    oldPrice: 260000,
    rating: 4.9,
    reviews: 340,
    stock: 180,
    specs: {
      "Dung tích": "Chai tạo bọt 150ml",
      "Độ pH": "3.8 - 4.2 chuẩn sinh lý",
      "Thành phần chính": "Dịch chiết lá trầu không, Cúc La Mã, Nano Bạc, Acid Lactic sinh học",
      "Hương thơm": "Thảo mộc thanh khiết tự nhiên",
      "Tính năng": "Kháng khuẩn 99%, dưỡng mềm da và làm dịu tức thì"
    }
  },
  {
    id: "4",
    name: "Nước Súc Miệng Diệt Khuẩn Không Cồn Listerine Cool Mint 750ml",
    description: "Công thức không chứa cồn êm dịu không cay rát nhưng vẫn giữ trọn sức mạnh tiêu diệt 99.9% vi khuẩn gây hôi miệng, mảng bám và viêm nướu với 4 loại tinh dầu tự nhiên.",
    categoryId: "C-01",
    image: "/images/C-01-02.jpg",
    imageBg: "from-teal-500 to-emerald-600",
    tag: "Bán chạy",
    price: 165000,
    oldPrice: 205000,
    rating: 4.9,
    reviews: 680,
    stock: 220,
    specs: {
      "Xuất xứ": "Thái Lan (Johnson & Johnson)",
      "Dung tích": "Chai lớn 750ml",
      "Công thức": "Zero Alcohol (Không cồn, không cay rát)",
      "Thành phần tinh dầu": "Eucalyptol, Menthol, Methyl Salicylate, Thymol",
      "Hiệu quả": "Bảo vệ khoang miệng sạch khuẩn 24 giờ"
    }
  },
  {
    id: "5",
    name: "Nước Nhỏ Mắt Giảm Mỏi & Sáng Mắt Sante FX Neo Nhật Bản 12ml",
    description: "Nước nhỏ mắt quốc dân Sante FX Neo với chỉ số the mát cấp độ 5 giải tỏa ngay tức khắc cơn mệt mỏi, cay xót và đỏ mắt khi làm việc với máy tính, điện thoại nhiều giờ liên tục.",
    categoryId: "C-04",
    image: "/images/C-04-01.jpg",
    imageBg: "from-blue-600 to-indigo-600",
    tag: "Mới",
    price: 135000,
    oldPrice: 170000,
    rating: 4.9,
    reviews: 540,
    stock: 190,
    specs: {
      "Xuất xứ": "Nhật Bản (Santen Pharmaceutical)",
      "Dung tích": "Lọ 12ml",
      "Độ the mát": "Cấp độ 5 (Sảng khoái mát lạnh)",
      "Thành phần chính": "Taurine 1%, Neostigmine Methylsulfate 0.005%, Vitamin B6 0.1%, L-Potassium Aspartate 1%",
      "Công dụng": "Giảm mỏi mắt, đỏ mắt, làm sạch bụi bẩn và phục hồi thị lực nhanh chóng"
    }
  }
];
