export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerGradient: string;
  badgeColor: string;
  iconName: "ShirtIcon" | "DeviceIcon" | "HomeIcon" | "SparklesIcon";
  itemCountText: string;
  subcategories?: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "thoi-trang",
    slug: "thoi-trang",
    name: "Thời Trang",
    description: "Khám phá các xu hướng thời trang mới nhất, phong cách trẻ trung và thanh lịch dành cho mọi lứa tuổi.",
    bannerGradient: "from-pink-600 via-rose-500 to-amber-500",
    badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    iconName: "ShirtIcon",
    itemCountText: "1,240 sản phẩm",
    subcategories: ["Áo khoác", "Áo thun", "Quần jeans", "Giày dép", "Váy đầm"]
  },
  {
    id: "dien-tu",
    slug: "dien-tu",
    name: "Điện Tử",
    description: "Các sản phẩm công nghệ cao cấp, thiết bị âm thanh, máy tính và phụ kiện điện tử hiện đại hàng đầu.",
    bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconName: "DeviceIcon",
    itemCountText: "850 sản phẩm",
    subcategories: ["Tai nghe", "Bàn phím", "Chuột máy tính", "Loa Bluetooth", "Smartwatch"]
  },
  {
    id: "gia-dung",
    slug: "gia-dung",
    name: "Gia Dụng",
    description: "Tiện ích cho ngôi nhà ấm cúng của bạn với đồ dùng thông minh, chất liệu bền bỉ và an toàn sức khỏe.",
    bannerGradient: "from-emerald-600 via-teal-500 to-cyan-500",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconName: "HomeIcon",
    itemCountText: "640 sản phẩm",
    subcategories: ["Bình giữ nhiệt", "Nồi chiên", "Máy xay", "Đèn bàn", "Dụng cụ nhà bếp"]
  },
  {
    id: "phu-kien",
    slug: "phu-kien",
    name: "Phụ Kiện",
    description: "Tạo điểm nhấn phong cách cá nhân với bộ sưu tập phụ kiện độc đáo, sang trọng và thời thượng.",
    bannerGradient: "from-purple-600 via-violet-600 to-fuchsia-500",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconName: "SparklesIcon",
    itemCountText: "920 sản phẩm",
    subcategories: ["Đồng hồ", "Kính mắt", "Balo - Túi xách", "Ví da", "Trang sức"]
  }
];
