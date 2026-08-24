import rawProducts from "./products.json";
import rawAlterProducts from "./alter-products.json";

export interface Product {
  id: string;
  name: string;
  description: string;
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

// Ưu tiên alter-products.json nếu có dữ liệu
const alterProducts = rawAlterProducts as unknown as Product[];
const baseProducts = rawProducts as unknown as Product[];

export const PRODUCTS: Product[] =
  Array.isArray(alterProducts) && alterProducts.length > 0
    ? alterProducts
    : baseProducts;