export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerGradient: string;
  badgeColor: string;
  iconName: "ToothIcon" | "PillIcon" | "HeartIcon" | "EyeIcon" | "DropIcon" | "ShirtIcon" | "DeviceIcon" | "HomeIcon" | "SparklesIcon";
  itemCountText: string;
  subcategories?: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "C-01",
    slug: "cham-soc-rang-mieng",
    name: "Chăm Sóc Răng Miệng",
    description: "Các giải pháp bảo vệ răng miệng toàn diện, làm trắng sáng tự nhiên, ngừa sâu răng và giữ hơi thở thơm mát.",
    bannerGradient: "from-cyan-500 via-blue-500 to-indigo-600",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    iconName: "ToothIcon",
    itemCountText: "2 sản phẩm",
    subcategories: ["Kem đánh răng", "Nước súc miệng", "Trắng răng", "Kháng khuẩn"]
  },
  {
    id: "C-02",
    slug: "thuc-pham-bo-sung",
    name: "Thực Phẩm Bổ Sung",
    description: "Sản phẩm hỗ trợ dinh dưỡng, bổ sung khoáng chất, canxi sinh học và dưỡng chất thúc đẩy phát triển chiều cao tối ưu.",
    bannerGradient: "from-amber-500 via-orange-500 to-rose-500",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconName: "PillIcon",
    itemCountText: "1 sản phẩm",
    subcategories: ["Viên uống tăng chiều cao", "Canxi & Khoáng chất"]
  },
  {
    id: "C-03",
    slug: "cham-soc-phu-nu",
    name: "Chăm Sóc Phụ Nữ",
    description: "Sản phẩm chăm sóc và vệ sinh vùng nhạy cảm với công nghệ tạo bọt siêu mịn, dịu nhẹ và cân bằng pH chuẩn y khoa.",
    bannerGradient: "from-pink-500 via-rose-400 to-fuchsia-500",
    badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    iconName: "HeartIcon",
    itemCountText: "1 sản phẩm",
    subcategories: ["Bọt vệ sinh phụ nữ", "Thảo mộc tự nhiên"]
  },
  {
    id: "C-04",
    slug: "cham-soc-mat",
    name: "Chăm Sóc Mắt",
    description: "Dung dịch nhỏ mắt và cấp ẩm chuyên sâu, bảo vệ thị lực, giảm mỏi và khô mắt khi tiếp xúc thiết bị điện tử.",
    bannerGradient: "from-blue-600 via-indigo-500 to-sky-400",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconName: "EyeIcon",
    itemCountText: "2 sản phẩm",
    subcategories: ["Nước nhỏ mắt", "Giảm mỏi mắt"]
  }
];
