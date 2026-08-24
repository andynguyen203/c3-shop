import rawCategories from "./categories.json";
import rawAlterCategories from "./alter-categories.json";

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

const alterCategories = rawAlterCategories as unknown as Category[];
const baseCategories = rawCategories as unknown as Category[];

export const CATEGORIES: Category[] =
  Array.isArray(alterCategories) && alterCategories.length > 0
    ? alterCategories
    : baseCategories;


