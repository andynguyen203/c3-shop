import rawProducts from "./products.json";

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

export const PRODUCTS: Product[] = rawProducts as any as Product[];