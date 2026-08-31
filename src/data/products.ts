import rawProducts from "./products.json";

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
  ingredients?: string;
}

export const PRODUCTS: Product[] = rawProducts as unknown as Product[];