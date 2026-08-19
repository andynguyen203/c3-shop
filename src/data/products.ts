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
    name: "VIÊN UỐNG TĂNG CHIỀU CAO GH CREATION EX+ NHẬT - 270 VIÊN",
    description: "Cách sử dụng\n- Mỗi ngày dùng 3 viên, uống trước khi đi ngủ vào khoảng 21-22 giờ, vì thời gian hấp thụ tốt nhất là vào 23h-2h sáng.\n- Trước và sau khi uống thuốc không nên ăn uống thêm gì.\n- Để đạt hiệu quả tốt nhất nên sử dụng theo liệu trình 3 lọ 1 năm.\n- Để đạt được hiệu quả tốt nhất cần ngủ đủ 7 - 8 tiếng/ ngày, luyện tập thể dục thể thao ít nhất 30 phút mỗi ngày và kết hợp chế độ dinh dưỡng hợp lý để thúc đẩy trao đổi chất.\nCông dụng nổi bật\n- Thúc đẩy hoạt động tiết Hormone tăng trưởng trong cơ thể sản sinh ra một cách tự nhiên nhất mà không hề gây tác dụng phụ.\n- Hiệu quả hỗ trợ tăng chiều cao từ 4-30 tuổi, cải thiện chiều cao tối đa 2-5cm/liệu trình.\n- Kích thích sự phát triển các mô sụn đầu xương giúp xương dài ra và tăng chiều cao.\n- Thành phần và cơ chế tăng chiều cao tự nhiên, an toàn, không tác dụng phụ được chứng nhận tại Nhật.\n- Rút ngắn thời gian phục hồi sau chấn thương hoặc phẫu thuật, làm lành vết thương và cải thiện chức năng miễn dịch của cơ thể.",
    categoryId: "C-02",
    image: "/images/C-02-01.jpg",
    imageBg: "from-amber-500 to-orange-500",
    price: 850000,
    oldPrice: 850000,
    rating: 4.9,
    reviews: 312,
    tag: "Bán chạy nhất",
    stock: 85,
    specs: {
      "Xuất xứ": "Nhật Bản",
      "Quy cách": "Hộp 270 viên",
      "Thành phần": "- Alpha-GPC: Hỗ trợ não bộ sản sinh ra lượng Hormone tăng trưởng GH và ức chế Somatostatin (chất ngăn cản sản sinh Hormone GH), từ đó giúp phát triển chiều cao tối ưu.\n- Arginine: Tăng cường tổng hợp Protein, góp phần vào quá trình hình thành và giải phóng Hormone tăng trưởng chiều cao GH, làm lành nhanh viết thương.\n- Bone Peptide: Hỗ trợ sản sinh tế bào mới liên tục, giúp xương chắc khỏe, tạo khung xương cứng cáp cho trẻ giai đoạn dậy thì.\n- Canxi san hô (Coral Calcium): Tham gia vào quá trình hình thành và phát triển xương, giúp tăng mật độ xương, ngừa loãng xương, thoái hóa.\n- Một số thành phần khác: Collagen Peptide, Men khô, Men chứa kẽm.\n- Hàm lượng dinh dưỡng có trong 3 viên uống: Năng lượng (3.46kcal), Protein (0.01g), Lipid (0.01g), Carbohydrates (0.83g), Sodium (0-2mg)."
    }
  },
  {
    id: "2",
    name: "KEM ĐÁNH RĂNG MUỐI SUNSTAR 170g",
    description: "CÔNG DỤNG:\n- Giúp bảo vệ nướu chắc khoẻ\n- Tiêu diệt vi khuẩn gây sâu răng\n- Bảo vệ khoảng miệng, răng và nướu chắc khoẻ\n- Loại bỏ mùi hôi miệng\nTrẻ em dùng được",
    categoryId: "C-01",
    image: "/images/C-01-01.jpg",
    imageBg: "from-cyan-500 to-blue-600",
    tag: "Hot",
    price: 80000,
    oldPrice: 80000,
    rating: 4.9,
    reviews: 428,
    stock: 110,
    specs: {
      "Xuất xứ": "Nhật Bản",
      "Dung tích": "Tuýp 170g",
      "Thành phần": "Canxi carbonate, Vitamin E, Tinh thể muối, Sorbitol",
    }
  },
  {
    id: "3",
    name: "Bọt vệ sinh phụ nữ Laurier Delicate Foaming Wash 150ml",
    description: "- Sử dụng cho vùng da nhạy cảm cần chăm sóc một cách dịu nhẹ.\n- Làm sạch chất bẩn gây mùi và khô ráp da.\n- Bọt rửa siêu mịn rất nhẹ nhàng và làm sạch hiệu quả.\n- Độ pH nhẹ nhàng phù hợp làn da.\n- Không gây kích ứng\n- Không mùi\n- Không màu",
    categoryId: "C-03",
    image: "/images/C-03-01.jpg",
    imageBg: "from-pink-500 to-rose-500",
    tag: "Khuyên dùng",
    price: 260000,
    oldPrice: 260000,
    rating: 4.9,
    reviews: 340,
    stock: 180,
    specs: {
      "Xuất xứ": "Nhật Bản",
      "Dung tích": "Chai tạo bọt 150ml",
      "Thành phần": "",
    }
  },
  {
    id: "4",
    name: "NƯỚC SÚC MIỆNG PROPOLINSE PURE",
    description: "CÔNG DỤNG:\n- Đánh bay các mảng bám, chất bẩn trong miệng mà bàn chải không làm sạch ngay khi dùng lần đầu\n- Màu răng cải thiện rõ rệt sau 2 tuần sử dụng\n- Ngừa hôi miệng\n- Ngừa sâu răng\n- Hương thơm tươi mát dễ chịu và sảng khoái",
    categoryId: "C-01",
    image: "/images/C-01-02.jpg",
    imageBg: "from-teal-500 to-emerald-600",
    tag: "Bán chạy",
    price: 280000,
    oldPrice: 280000,
    rating: 4.9,
    reviews: 680,
    stock: 220,
    specs: {
      "Xuất xứ": "Nhật Bản",
      "Dung tích": "Chai lớn 600ml",
      "Thành phần": "Nước, ethanol (dung môi), glycerin (tác nhân làm ướt), axit citric, axit citric Na, axit malic (PH modifier), dầu thầu dầu hydro hóa, PEG 60 (chất hòa tan), chiết xuất lá trà, chiết xuất từ keo ong, Xylitol, menthol, saccharin Na (chất tạo hương), caramel (chất tạo màu), methuylparaben (chất bảo quản, hương liệu."
    }
  },
  {
    id: "5",
    name: "NƯỚC NHỎ MẮT SANTEN PC",
    description: "- Ngăn ngừa và làm giảm sự tác động của các tia bức xạ đến mắt, cải thiện sự tập trung khi làm việc\n- Tăng cường khả năng điều tiết giúp giảm thiểu tình trạng khô mắt, mỏi mắt, mờ mắt, nhức mắt,…\n- Cải thiện những vấn đề của mắt bị tổn thương thông qua việc tăng cường trao đổi chất ở mắt\n- Bảo vệ giác mạc, ngăn ngừa tình trạng lão hoá ở mắt\n- Tránh tình trạng thoái hoá điểm vàng, đục thể thuỷ tinh khi lớn tuổi\n- Phòng chống các bệnh lý liên quan đến mắt như xuất huyết mắt, viêm võng mạc do mắt phải làm việc quá tải\n- Duy trì đôi mắt khỏe mạnh, cải thiện thị lực\n- Màu đỏ: độ cay vừa phải, không dùng khi đeo kính áp tròng\n- Màu vàng: không cay, dùng trực tiếp lên kính áp tròng",
    categoryId: "C-04",
    image: "/images/C-04-01.jpg",
    imageBg: "from-blue-600 to-indigo-600",
    tag: "Mới",
    price: 160000,
    oldPrice: 160000,
    rating: 4.9,
    reviews: 540,
    stock: 190,
    specs: {
      "Xuất xứ": "Nhật Bản",
      "Dung tích": "Lọ 12ml",
      "Thành phần": "Vitamin B12, Natri chondroitin sulfat, Vitamin B6, Neostigmine methyl sulfate, Taurin, Dipotassium glycyrrhizinate, Chlorpheniramine maleate, Tetrahydrozoline hydrochloride và các thành phần khác"
    }
  },
  {
    id: "6",
    name: "Thuốc Nhỏ Mắt Rohto Vita Nhật Bản",
    description: "CÔNG DỤNG:\n- Giúp lưu thông máu và làm giảm mỏi mắt. “Vitamin B6” đã thúc đẩy việc trao đổi chất của tế bào mắt, và cải thiện sự mệt mỏi cho mắt.\n- Phòng chống các bệnh về mắt do tác nhân của môi trường như máy tính, bơi lội, khói bụi.\n- Điều trị các bệnh về mắt như đau mắt đỏ, đau mí mắt, viêm mắt do tia cực tím.\n- Người cận thị hay đeo kính áp tròng, bị sung huyết, ngứa mắt, nhìn mờ.\n- Đặc biệt tốt cho dân văn phòng.\n\nĐối tượng sử dụng:\n- Người làm việc nhiều trước máy tính, người làm văn phòng, IT.\n- Người hay phải đi nhiều ngoài đường (tiếp xúc với nhiều khí thải, khói bụi) hay những vận động viên bơi lội, người thường xuyên đi bơi.\n- Người bị cận thị cần được hỗ trợ điều trị một số vấn đề về mắt.",
    categoryId: "C-04",
    image: "/images/C-04-02.jpg",
    imageBg: "from-sky-500 to-blue-600",
    tag: "Mới",
    price: 60000,
    oldPrice: 60000,
    rating: 4.9,
    reviews: 215,
    stock: 150,
    specs: {
      "Xuất xứ": "Nhật Bản",
      "Dung tích": "Lọ 12ml",
      "Thành phần": "Vitamin E tự nhiên (d-α-tocopherol acetate), Vitamin B6, Sodium Chondroitin Sulfate, L-Potassium Aspartate",
    }
  }
];
