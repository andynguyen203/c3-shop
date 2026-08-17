import { productService } from "@/services/productService";
import { notFound } from "next/navigation";
import ProductDetailPage from "./ProductDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return productService.getAllProducts().map((product) => ({
    id: product.id,
  }));
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = productService.getProductById(id);

  if (!product) {
    notFound();
  }

  const related = productService
    .getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailPage product={product} related={related} />;
}
