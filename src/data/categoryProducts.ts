import rawCategoryProducts from "./category_products.json";
import rawAlterCategoryProducts from "./alter-category-products.json";

export interface CategoryProductMapping {
  categoryId: string;
  productId: string;
}

const alterMappings = rawAlterCategoryProducts as CategoryProductMapping[];
const baseMappings = rawCategoryProducts as CategoryProductMapping[];

export const CATEGORY_PRODUCTS: CategoryProductMapping[] =
  Array.isArray(alterMappings) && alterMappings.length > 0
    ? alterMappings
    : baseMappings;

