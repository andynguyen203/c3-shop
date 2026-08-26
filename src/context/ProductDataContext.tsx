"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS as DEFAULT_PRODUCTS, Product } from "@/data/products";
import { CATEGORIES as DEFAULT_CATEGORIES, Category } from "@/data/categories";
import { CATEGORY_PRODUCTS as DEFAULT_CATEGORY_PRODUCTS, CategoryProductMapping } from "@/data/categoryProducts";
import { FEATURED_PRODUCT_ORDER as DEFAULT_ORDER, ProductOrder } from "@/data/order";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_PRODUCTS_KEY = "japan_shop_products_v5";
const STORAGE_CATEGORIES_KEY = "japan_shop_categories_v5";
const STORAGE_CATEGORY_PRODUCTS_KEY = "japan_shop_category_products_v5";
const STORAGE_ORDER_KEY = "japan_shop_order_v5";

// Database row mappings
interface DbProductRow {
  id: string;
  name: string;
  description: string | null;
  image: string;
  image_bg: string | null;
  price: number;
  old_price: number | null;
  rating: number;
  reviews: number;
  tag: string | null;
  stock: number;
  specs: Record<string, string> | null;
}

interface DbCategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  banner_gradient: string | null;
  badge_color: string | null;
  icon_name: string | null;
  item_count_text: string | null;
  subcategories: string[] | null;
}

interface DbCategoryProductRow {
  category_id: string;
  product_id: string;
}

interface DbProductOrderRow {
  product_id: string;
  order_num: number;
}

function mapDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    image: row.image,
    imageBg: row.image_bg || undefined,
    price: Number(row.price) || 0,
    oldPrice: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : undefined,
    rating: Number(row.rating) || 5.0,
    reviews: Number(row.reviews) || 0,
    tag: row.tag || undefined,
    stock: Number(row.stock) || 0,
    specs: row.specs || undefined,
  };
}

function mapProductToDb(p: Product) {
  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    image: p.image,
    image_bg: p.imageBg || "",
    price: p.price,
    old_price: p.oldPrice ?? null,
    rating: p.rating ?? 5.0,
    reviews: p.reviews ?? 0,
    tag: p.tag ?? null,
    stock: p.stock ?? 0,
    specs: p.specs ?? {},
  };
}

function mapDbCategory(row: DbCategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    bannerGradient: row.banner_gradient || "from-indigo-600 to-violet-700",
    badgeColor: row.badge_color || "bg-indigo-500",
    iconName: (row.icon_name || "SparklesIcon") as Category["iconName"],
    itemCountText: row.item_count_text || "0 sản phẩm",
    subcategories: Array.isArray(row.subcategories) ? row.subcategories : [],
  };
}

function mapCategoryToDb(c: Category) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || "",
    banner_gradient: c.bannerGradient || "from-indigo-600 to-violet-700",
    badge_color: c.badgeColor || "bg-indigo-500",
    icon_name: c.iconName || "SparklesIcon",
    item_count_text: c.itemCountText || "0 sản phẩm",
    subcategories: c.subcategories || [],
  };
}

export type SupabaseConnectionStatus = "connected" | "not_configured" | "error" | "loading";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  categoryProducts: CategoryProductMapping[];
  orders: ProductOrder[];
  isLoaded: boolean;
  supabaseStatus: SupabaseConnectionStatus;
  addProduct: (product: Omit<Product, "id"> & { id?: string; order?: number; categoryId?: string }) => Promise<void>;
  updateProduct: (id: string, updated: Partial<Product> & { order?: number; categoryId?: string }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductOrder: (productId: string, newOrder: number) => Promise<void>;
  toggleFeatured: (productId: string, isFeatured: boolean, tag?: string) => Promise<void>;
  moveProductOrder: (productId: string, direction: "up" | "down") => Promise<void>;
  resetToDefault: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, updated: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  resetCategoriesToDefault: () => void;
  exportCategoriesJSON: () => string;
  importCategoriesJSON: (jsonString: string) => boolean;
  getProductsByCategoryId: (categoryId: string) => Product[];
  getCategoryIdByProductId: (productId: string) => string | undefined;
  setCategoryProducts: (categoryId: string, productIds: string[]) => Promise<void>;
  assignProductToCategory: (productId: string, categoryId: string) => Promise<void>;
  removeProductFromCategory: (productId: string, categoryId: string) => Promise<void>;
  exportCategoryProductsJSON: () => string;
  importCategoryProductsJSON: (jsonString: string) => boolean;
  resetCategoryProductsToDefault: () => void;
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: (limit?: number) => Product[];
  seedInitialDataToSupabase: () => Promise<{ success: boolean; message: string }>;
  refreshFromSupabase: () => Promise<void>;
}

const ProductDataContext = createContext<ProductContextType | undefined>(undefined);

export function ProductDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoryProducts, setCategoryProductsState] = useState<CategoryProductMapping[]>(DEFAULT_CATEGORY_PRODUCTS);
  const [orders, setOrders] = useState<ProductOrder[]>(DEFAULT_ORDER);
  const [isLoaded, setIsLoaded] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionStatus>("loading");

  // Save to localStorage as backup / offline cache
  const persistToLocalStorage = useCallback((
    newProducts: Product[],
    newCategories: Category[],
    newCategoryProducts: CategoryProductMapping[],
    newOrders: ProductOrder[]
  ) => {
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(newProducts));
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(newCategories));
      localStorage.setItem(STORAGE_CATEGORY_PRODUCTS_KEY, JSON.stringify(newCategoryProducts));
      localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.warn("Failed to persist data to localStorage", e);
    }
  }, []);

  // Fetch all data from Supabase
  const fetchDataFromSupabase = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured()) {
      setSupabaseStatus("not_configured");
      return false;
    }

    try {
      const [catRes, prodRes, catProdRes, ordRes] = await Promise.all([
        supabase.from("categories").select("*").order("name", { ascending: true }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("category_products").select("category_id, product_id"),
        supabase.from("product_orders").select("product_id, order_num").order("order_num", { ascending: true }),
      ]);

      if (catRes.error || prodRes.error || catProdRes.error || ordRes.error) {
        const isTableNotFound =
          catRes.error?.code === "PGRST205" ||
          prodRes.error?.code === "PGRST205" ||
          catProdRes.error?.code === "PGRST205" ||
          ordRes.error?.code === "PGRST205";

        if (isTableNotFound) {
          console.warn(
            "⚠️ Chưa tìm thấy bảng dữ liệu trên Supabase (Mã PGRST205). Vui lòng vào Supabase SQL Editor và chạy file 'supabase-schema.sql' để khởi tạo bảng."
          );
        } else {
          console.error("Supabase fetch error:", {
            categories: catRes.error,
            products: prodRes.error,
            categoryProducts: catProdRes.error,
            orders: ordRes.error,
          });
        }
        setSupabaseStatus("error");
        return false;
      }

      // If database has records
      const dbCategories = (catRes.data as unknown as DbCategoryRow[]) || [];
      const dbProducts = (prodRes.data as unknown as DbProductRow[]) || [];
      const dbCatProducts = (catProdRes.data as unknown as DbCategoryProductRow[]) || [];
      const dbOrders = (ordRes.data as unknown as DbProductOrderRow[]) || [];

      if (dbProducts.length > 0 || dbCategories.length > 0) {
        const loadedProducts = dbProducts.map(mapDbProduct);
        const loadedCategories = dbCategories.map(mapDbCategory);
        const loadedCatProducts: CategoryProductMapping[] = dbCatProducts.map((cp) => ({
          categoryId: cp.category_id,
          productId: cp.product_id,
        }));
        const loadedOrders: ProductOrder[] = dbOrders.map((o) => ({
          productId: o.product_id,
          order: o.order_num,
        }));

        setProducts(loadedProducts);
        setCategories(loadedCategories);
        setCategoryProductsState(loadedCatProducts);
        setOrders(loadedOrders);
        persistToLocalStorage(loadedProducts, loadedCategories, loadedCatProducts, loadedOrders);
        setSupabaseStatus("connected");
        return true;
      } else {
        // Table exists but is empty
        setSupabaseStatus("connected");
        return false;
      }
    } catch (err) {
      console.error("Failed to connect to Supabase", err);
      setSupabaseStatus("error");
      return false;
    }
  }, [persistToLocalStorage]);

  // Initial Load
  useEffect(() => {
    let isMounted = true;

    async function init() {
      // 1. First load from localStorage for instant display
      let initialProducts = DEFAULT_PRODUCTS;
      let initialCategories = DEFAULT_CATEGORIES;
      let initialCatProducts = DEFAULT_CATEGORY_PRODUCTS;
      let initialOrders = DEFAULT_ORDER;

      try {
        const savedProducts = localStorage.getItem(STORAGE_PRODUCTS_KEY);
        const savedCategories = localStorage.getItem(STORAGE_CATEGORIES_KEY);
        const savedCategoryProducts = localStorage.getItem(STORAGE_CATEGORY_PRODUCTS_KEY);
        const savedOrders = localStorage.getItem(STORAGE_ORDER_KEY);

        if (savedProducts) initialProducts = JSON.parse(savedProducts);
        if (savedCategories) initialCategories = JSON.parse(savedCategories);
        if (savedCategoryProducts) initialCatProducts = JSON.parse(savedCategoryProducts);
        if (savedOrders) initialOrders = JSON.parse(savedOrders);

        if (isMounted) {
          setProducts(initialProducts);
          setCategories(initialCategories);
          setCategoryProductsState(initialCatProducts);
          setOrders(initialOrders);
        }
      } catch (e) {
        console.warn("Failed to load data from localStorage", e);
      }

      // 2. Fetch latest data from Supabase
      if (isSupabaseConfigured()) {
        await fetchDataFromSupabase();
      } else {
        if (isMounted) {
          setSupabaseStatus("not_configured");
        }
      }

      if (isMounted) {
        setIsLoaded(true);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchDataFromSupabase]);

  // --- Seed Initial Data to Supabase ---
  const seedInitialDataToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, message: "Chưa cấu hình Supabase URL và Anon Key trong .env" };
    }

    try {
      setSupabaseStatus("loading");

      // 1. Categories
      const categoriesToInsert = DEFAULT_CATEGORIES.map(mapCategoryToDb);
      const { error: catErr } = await supabase.from("categories").upsert(categoriesToInsert, { onConflict: "id" });
      if (catErr) throw new Error(`Lỗi danh mục: ${catErr.message}`);

      // 2. Products
      const productsToInsert = DEFAULT_PRODUCTS.map(mapProductToDb);
      const { error: prodErr } = await supabase.from("products").upsert(productsToInsert, { onConflict: "id" });
      if (prodErr) throw new Error(`Lỗi sản phẩm: ${prodErr.message}`);

      // 3. Category Products
      const catProdToInsert = DEFAULT_CATEGORY_PRODUCTS.map((cp) => ({
        category_id: cp.categoryId,
        product_id: cp.productId,
      }));
      // Clear old mappings to avoid duplicates
      await supabase.from("category_products").delete().neq("id", 0);
      const { error: cpErr } = await supabase.from("category_products").insert(catProdToInsert);
      if (cpErr) throw new Error(`Lỗi liên kết danh mục - sản phẩm: ${cpErr.message}`);

      // 4. Orders
      const ordersToInsert = DEFAULT_ORDER.map((o) => ({
        product_id: o.productId,
        order_num: o.order,
      }));
      const { error: ordErr } = await supabase.from("product_orders").upsert(ordersToInsert, { onConflict: "product_id" });
      if (ordErr) throw new Error(`Lỗi thứ tự hiển thị: ${ordErr.message}`);

      await fetchDataFromSupabase();
      setSupabaseStatus("connected");
      return { success: true, message: `Đồng bộ thành công ${DEFAULT_PRODUCTS.length} sản phẩm và ${DEFAULT_CATEGORIES.length} danh mục lên Supabase!` };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setSupabaseStatus("error");
      return { success: false, message: `Thất bại: ${errorMsg}` };
    }
  };

  const refreshFromSupabase = async () => {
    await fetchDataFromSupabase();
  };

  // --- Product CRUD with Supabase sync ---
  const addProduct = async (item: Omit<Product, "id"> & { id?: string; order?: number; categoryId?: string }) => {
    const nextId = item.id?.trim() || String(Date.now());
    const newProduct: Product = {
      id: nextId,
      name: item.name,
      description: item.description,
      image: item.image,
      imageBg: item.imageBg,
      price: item.price,
      oldPrice: item.oldPrice,
      rating: item.rating ?? 5.0,
      reviews: item.reviews ?? 0,
      tag: item.tag,
      stock: item.stock,
      specs: item.specs,
    };

    const nextOrder = item.order ?? (orders.length > 0 ? Math.max(...orders.map((o) => o.order)) + 1 : 1);
    const newOrders = [...orders, { productId: nextId, order: nextOrder }];
    const newProducts = [...products, newProduct];
    let newCategoryProducts = [...categoryProducts];

    if (item.categoryId) {
      newCategoryProducts = [...newCategoryProducts, { categoryId: item.categoryId, productId: nextId }];
    }

    setProducts(newProducts);
    setOrders(newOrders);
    setCategoryProductsState(newCategoryProducts);
    persistToLocalStorage(newProducts, categories, newCategoryProducts, newOrders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("products").insert(mapProductToDb(newProduct));
        await supabase.from("product_orders").upsert({ product_id: nextId, order_num: nextOrder });
        if (item.categoryId) {
          await supabase.from("category_products").insert({ category_id: item.categoryId, product_id: nextId });
        }
      } catch (err) {
        console.error("Failed to add product to Supabase", err);
      }
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product> & { order?: number; categoryId?: string }) => {
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, ...updated } : p));
    let updatedOrders = [...orders];
    let updatedCategoryProducts = [...categoryProducts];

    if (updated.order !== undefined) {
      const existing = updatedOrders.find((o) => o.productId === id);
      if (existing) {
        updatedOrders = updatedOrders.map((o) => (o.productId === id ? { ...o, order: updated.order! } : o));
      } else {
        updatedOrders.push({ productId: id, order: updated.order });
      }
    }

    if (updated.categoryId !== undefined) {
      updatedCategoryProducts = updatedCategoryProducts.filter((cp) => cp.productId !== id);
      if (updated.categoryId) {
        updatedCategoryProducts.push({ categoryId: updated.categoryId, productId: id });
      }
    }

    setProducts(updatedProducts);
    setOrders(updatedOrders);
    setCategoryProductsState(updatedCategoryProducts);
    persistToLocalStorage(updatedProducts, categories, updatedCategoryProducts, updatedOrders);

    if (supabase && isSupabaseConfigured()) {
      try {
        const fullProduct = updatedProducts.find((p) => p.id === id);
        if (fullProduct) {
          await supabase.from("products").update(mapProductToDb(fullProduct)).eq("id", id);
        }
        if (updated.order !== undefined) {
          await supabase.from("product_orders").upsert({ product_id: id, order_num: updated.order });
        }
        if (updated.categoryId !== undefined) {
          await supabase.from("category_products").delete().eq("product_id", id);
          if (updated.categoryId) {
            await supabase.from("category_products").insert({ category_id: updated.categoryId, product_id: id });
          }
        }
      } catch (err) {
        console.error("Failed to update product in Supabase", err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const newProducts = products.filter((p) => p.id !== id);
    const newOrders = orders.filter((o) => o.productId !== id);
    const newCategoryProducts = categoryProducts.filter((cp) => cp.productId !== id);

    setProducts(newProducts);
    setOrders(newOrders);
    setCategoryProductsState(newCategoryProducts);
    persistToLocalStorage(newProducts, categories, newCategoryProducts, newOrders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("products").delete().eq("id", id);
        await supabase.from("category_products").delete().eq("product_id", id);
        await supabase.from("product_orders").delete().eq("product_id", id);
      } catch (err) {
        console.error("Failed to delete product in Supabase", err);
      }
    }
  };

  const updateProductOrder = async (productId: string, newOrder: number) => {
    const existing = orders.find((o) => o.productId === productId);
    let newOrders: ProductOrder[];
    if (existing) {
      newOrders = orders.map((o) => (o.productId === productId ? { ...o, order: newOrder } : o));
    } else {
      newOrders = [...orders, { productId, order: newOrder }];
    }

    setOrders(newOrders);
    persistToLocalStorage(products, categories, categoryProducts, newOrders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("product_orders").upsert({ product_id: productId, order_num: newOrder });
      } catch (err) {
        console.error("Failed to update order in Supabase", err);
      }
    }
  };

  const toggleFeatured = async (productId: string, isFeatured: boolean, defaultTag = "Bán chạy") => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    if (isFeatured) {
      await updateProduct(productId, { tag: target.tag || defaultTag });
    } else {
      await updateProduct(productId, { tag: undefined });
    }
  };

  const moveProductOrder = async (productId: string, direction: "up" | "down") => {
    const currentFeatured = getFeaturedProducts();
    const currentIndex = currentFeatured.findIndex((p) => p.id === productId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentFeatured.length) return;

    const otherProduct = currentFeatured[targetIndex];
    const orderMap = new Map<string, number>(orders.map((o) => [o.productId, o.order]));

    const currentOrder = orderMap.get(productId) ?? currentIndex + 1;
    const otherOrder = orderMap.get(otherProduct.id) ?? targetIndex + 1;

    let newOrders = [...orders];
    newOrders = newOrders.map((o) => {
      if (o.productId === productId) return { ...o, order: otherOrder };
      if (o.productId === otherProduct.id) return { ...o, order: currentOrder };
      return o;
    });

    setOrders(newOrders);
    persistToLocalStorage(products, categories, categoryProducts, newOrders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("product_orders").upsert([
          { product_id: productId, order_num: otherOrder },
          { product_id: otherProduct.id, order_num: currentOrder },
        ]);
      } catch (err) {
        console.error("Failed to update move order in Supabase", err);
      }
    }
  };

  // --- Category CRUD with Supabase sync ---
  const addCategory = async (category: Category) => {
    const newCategories = [...categories, category];
    setCategories(newCategories);
    persistToLocalStorage(products, newCategories, categoryProducts, orders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("categories").insert(mapCategoryToDb(category));
      } catch (err) {
        console.error("Failed to add category in Supabase", err);
      }
    }
  };

  const updateCategory = async (id: string, updated: Partial<Category>) => {
    const newCategories = categories.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat));
    setCategories(newCategories);
    persistToLocalStorage(products, newCategories, categoryProducts, orders);

    if (supabase && isSupabaseConfigured()) {
      try {
        const fullCat = newCategories.find((c) => c.id === id);
        if (fullCat) {
          await supabase.from("categories").update(mapCategoryToDb(fullCat)).eq("id", id);
        }
      } catch (err) {
        console.error("Failed to update category in Supabase", err);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    const newCategories = categories.filter((cat) => cat.id !== id);
    const newCategoryProducts = categoryProducts.filter((cp) => cp.categoryId !== id);

    setCategories(newCategories);
    setCategoryProductsState(newCategoryProducts);
    persistToLocalStorage(products, newCategories, newCategoryProducts, orders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("categories").delete().eq("id", id);
        await supabase.from("category_products").delete().eq("category_id", id);
      } catch (err) {
        console.error("Failed to delete category in Supabase", err);
      }
    }
  };

  // --- Category-Product Mappings ---
  const getProductsByCategoryId = (categoryId: string) => {
    const targetId = categoryId.toLowerCase().trim();
    const matchedProductIds = new Set(
      categoryProducts
        .filter((cp) => cp.categoryId.toLowerCase().trim() === targetId)
        .map((cp) => cp.productId)
    );
    return products.filter((p) => matchedProductIds.has(p.id));
  };

  const getCategoryIdByProductId = (productId: string) => {
    const match = categoryProducts.find((cp) => cp.productId === productId);
    return match?.categoryId;
  };

  const setCategoryProducts = async (categoryId: string, productIds: string[]) => {
    const targetId = categoryId.trim();
    const remaining = categoryProducts.filter((cp) => cp.categoryId !== targetId);
    const newMappings: CategoryProductMapping[] = productIds.map((pId) => ({
      categoryId: targetId,
      productId: pId,
    }));

    const updated = [...remaining, ...newMappings];
    setCategoryProductsState(updated);
    persistToLocalStorage(products, categories, updated, orders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("category_products").delete().eq("category_id", targetId);
        if (newMappings.length > 0) {
          await supabase.from("category_products").insert(
            newMappings.map((m) => ({ category_id: m.categoryId, product_id: m.productId }))
          );
        }
      } catch (err) {
        console.error("Failed to set category products in Supabase", err);
      }
    }
  };

  const assignProductToCategory = async (productId: string, categoryId: string) => {
    const exists = categoryProducts.some(
      (cp) => cp.productId === productId && cp.categoryId === categoryId
    );
    if (!exists) {
      const updated = [...categoryProducts, { categoryId, productId }];
      setCategoryProductsState(updated);
      persistToLocalStorage(products, categories, updated, orders);

      if (supabase && isSupabaseConfigured()) {
        try {
          await supabase.from("category_products").insert({ category_id: categoryId, product_id: productId });
        } catch (err) {
          console.error("Failed to assign product category in Supabase", err);
        }
      }
    }
  };

  const removeProductFromCategory = async (productId: string, categoryId: string) => {
    const updated = categoryProducts.filter(
      (cp) => !(cp.productId === productId && cp.categoryId === categoryId)
    );
    setCategoryProductsState(updated);
    persistToLocalStorage(products, categories, updated, orders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from("category_products").delete().match({ category_id: categoryId, product_id: productId });
      } catch (err) {
        console.error("Failed to remove product from category in Supabase", err);
      }
    }
  };

  // --- Reset & JSON Import/Export ---
  const resetToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    setOrders(DEFAULT_ORDER);
    setCategoryProductsState(DEFAULT_CATEGORY_PRODUCTS);
    persistToLocalStorage(DEFAULT_PRODUCTS, categories, DEFAULT_CATEGORY_PRODUCTS, DEFAULT_ORDER);
  };

  const resetCategoriesToDefault = () => {
    setCategories(DEFAULT_CATEGORIES);
    setCategoryProductsState(DEFAULT_CATEGORY_PRODUCTS);
    persistToLocalStorage(products, DEFAULT_CATEGORIES, DEFAULT_CATEGORY_PRODUCTS, orders);
  };

  const resetCategoryProductsToDefault = () => {
    setCategoryProductsState(DEFAULT_CATEGORY_PRODUCTS);
    persistToLocalStorage(products, categories, DEFAULT_CATEGORY_PRODUCTS, orders);
  };

  const exportJSON = () => JSON.stringify(products, null, 2);

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return false;
      const newOrders: ProductOrder[] = parsed.map((p: Product, idx: number) => ({
        productId: String(p.id),
        order: idx + 1,
      }));
      setProducts(parsed);
      setOrders(newOrders);
      persistToLocalStorage(parsed, categories, categoryProducts, newOrders);
      return true;
    } catch {
      return false;
    }
  };

  const exportCategoriesJSON = () => JSON.stringify(categories, null, 2);

  const importCategoriesJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return false;
      setCategories(parsed);
      persistToLocalStorage(products, parsed, categoryProducts, orders);
      return true;
    } catch {
      return false;
    }
  };

  const exportCategoryProductsJSON = () => JSON.stringify(categoryProducts, null, 2);

  const importCategoryProductsJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return false;
      setCategoryProductsState(parsed);
      persistToLocalStorage(products, categories, parsed, orders);
      return true;
    } catch {
      return false;
    }
  };

  // --- Selectors ---
  const getProductById = (id: string) => {
    return products.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
  };

  const getFeaturedProducts = (limit?: number) => {
    const orderMap = new Map<string, number>(orders.map((o) => [o.productId, o.order]));

    const featured = [...products]
      .filter((p) => p.tag !== undefined && p.tag.trim() !== "")
      .sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });

    return limit ? featured.slice(0, limit) : featured;
  };

  return (
    <ProductDataContext.Provider
      value={{
        products,
        categories,
        categoryProducts,
        orders,
        isLoaded,
        supabaseStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductOrder,
        toggleFeatured,
        moveProductOrder,
        resetToDefault,
        exportJSON,
        importJSON,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,
        exportCategoriesJSON,
        importCategoriesJSON,
        getProductsByCategoryId,
        getCategoryIdByProductId,
        setCategoryProducts,
        assignProductToCategory,
        removeProductFromCategory,
        exportCategoryProductsJSON,
        importCategoryProductsJSON,
        resetCategoryProductsToDefault,
        getProductById,
        getFeaturedProducts,
        seedInitialDataToSupabase,
        refreshFromSupabase,
      }}
    >
      {children}
    </ProductDataContext.Provider>
  );
}

export function useProductData() {
  const context = useContext(ProductDataContext);
  if (!context) {
    throw new Error("useProductData must be used within a ProductDataProvider");
  }
  return context;
}
