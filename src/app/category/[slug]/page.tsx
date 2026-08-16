import { categoryService } from "@/services/categoryService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryDetailPage from "./CategoryDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryService.getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Danh mục không tồn tại - MyShop",
    };
  }

  return {
    title: `${category.name} - MyShop`,
    description: category.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = categoryService.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = categoryService.getProductsByCategorySlug(category.slug);
  const stats = categoryService.getCategoryStats(category.slug);
  const allCategories = categoryService.getAllCategories();

  return (
    <CategoryDetailPage
      category={category}
      products={products}
      stats={stats}
      allCategories={allCategories}
    />
  );
}
