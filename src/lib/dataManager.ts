import fs from "fs";
import path from "path";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { CategoryProductMapping } from "@/data/categoryProducts";
import { ProductOrder } from "@/data/order";

const DATA_DIR = path.join(process.cwd(), "src", "data");

const BASE_FILES = {
  products: path.join(DATA_DIR, "products.json"),
  categories: path.join(DATA_DIR, "categories.json"),
  categoryProducts: path.join(DATA_DIR, "category_products.json"),
  orders: path.join(DATA_DIR, "order.json"),
};

const ALTER_FILES = {
  products: path.join(DATA_DIR, "alter-products.json"),
  categories: path.join(DATA_DIR, "alter-categories.json"),
  categoryProducts: path.join(DATA_DIR, "alter-category-products.json"),
  orders: path.join(DATA_DIR, "alter-order.json"),
};

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8").trim();
    if (!content) return null;
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

function deleteJsonFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
}

/**
 * Gộp danh sách Sản phẩm (Ưu tiên alter-products.json)
 */
export function getMergedProducts(): Product[] {
  const baseProducts = readJsonFile<Product[]>(BASE_FILES.products) || [];
  const alterProducts = readJsonFile<Product[]>(ALTER_FILES.products);

  if (!alterProducts || !Array.isArray(alterProducts)) {
    return baseProducts;
  }

  // Khi có alter-products.json, sử dụng danh sách sản phẩm từ alter (chứa các thay đổi, thêm mới hoặc đã xóa)
  // và kết hợp các thông tin nếu cần.
  return alterProducts;
}

/**
 * Gộp danh sách Danh mục (Ưu tiên alter-categories.json)
 */
export function getMergedCategories(): Category[] {
  const baseCategories = readJsonFile<Category[]>(BASE_FILES.categories) || [];
  const alterCategories = readJsonFile<Category[]>(ALTER_FILES.categories);

  if (!alterCategories || !Array.isArray(alterCategories)) {
    return baseCategories;
  }

  return alterCategories;
}

/**
 * Gộp danh sách Phân bổ sản phẩm vào danh mục (Ưu tiên alter-category-products.json)
 */
export function getMergedCategoryProducts(): CategoryProductMapping[] {
  const baseMappings =
    readJsonFile<CategoryProductMapping[]>(BASE_FILES.categoryProducts) || [];
  const alterMappings = readJsonFile<CategoryProductMapping[]>(
    ALTER_FILES.categoryProducts
  );

  if (!alterMappings || !Array.isArray(alterMappings)) {
    return baseMappings;
  }

  return alterMappings;
}

/**
 * Gộp danh sách Thứ tự sản phẩm nổi bật / bán chạy (Ưu tiên alter-order.json)
 */
export function getMergedOrders(): ProductOrder[] {
  const baseOrders = readJsonFile<ProductOrder[]>(BASE_FILES.orders) || [];
  const alterOrders = readJsonFile<ProductOrder[]>(ALTER_FILES.orders);

  if (!alterOrders || !Array.isArray(alterOrders)) {
    return baseOrders;
  }

  return alterOrders;
}

/**
 * Lấy toàn bộ dữ liệu hợp nhất cho ứng dụng
 */
export function getAllMergedData() {
  return {
    products: getMergedProducts(),
    categories: getMergedCategories(),
    categoryProducts: getMergedCategoryProducts(),
    orders: getMergedOrders(),
  };
}

/**
 * Lưu dữ liệu chỉnh sửa vào file alter-*.json tương ứng
 */
export function saveAlterData(
  type: "products" | "categories" | "categoryProducts" | "orders",
  data: unknown
): boolean {
  const targetFile = ALTER_FILES[type];
  if (!targetFile) return false;
  return writeJsonFile(targetFile, data);
}

/**
 * Khôi phục gốc bằng cách xóa file alter-*.json
 */
export function resetAlterData(
  type: "products" | "categories" | "categoryProducts" | "orders" | "all"
): boolean {
  if (type === "all") {
    let success = true;
    for (const key of Object.keys(ALTER_FILES) as Array<keyof typeof ALTER_FILES>) {
      if (!deleteJsonFile(ALTER_FILES[key])) {
        success = false;
      }
    }
    return success;
  }

  const targetFile = ALTER_FILES[type];
  if (!targetFile) return false;
  return deleteJsonFile(targetFile);
}
