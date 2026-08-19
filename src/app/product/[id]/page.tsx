import { productService } from "@/services/productService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailPage from "./ProductDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return productService.getAllProducts().map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = productService.getProductById(id);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại - Japan Shop",
    };
  }

  return {
    title: `${product.name} - Japan Shop`,
    description: product.description,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = productService.getProductById(id);

  if (!product) {
    notFound();
  }

  const related = productService
    .getProductsByCategoryId(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailPage product={product} related={related} />;
}
