"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS as DEFAULT_PRODUCTS, Product } from "@/data/products";
import { CATEGORIES as DEFAULT_CATEGORIES, Category } from "@/data/categories";
import { CATEGORY_PRODUCTS as DEFAULT_CATEGORY_PRODUCTS, CategoryProductMapping } from "@/data/categoryProducts";
import { FEATURED_PRODUCT_ORDER as DEFAULT_ORDER, ProductOrder } from "@/data/order";

const STORAGE_PRODUCTS_KEY = "japan_shop_products_v5";
const STORAGE_CATEGORIES_KEY = "japan_shop_categories_v5";
const STORAGE_CATEGORY_PRODUCTS_KEY = "japan_shop_category_products_v5";
const STORAGE_ORDER_KEY = "japan_shop_order_v5";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  categoryProducts: CategoryProductMapping[];
  orders: ProductOrder[];
  isLoaded: boolean;
  addProduct: (product: Omit<Product, "id"> & { id?: string; order?: number; categoryId?: string }) => void;
  updateProduct: (id: string, updated: Partial<Product> & { order?: number; categoryId?: string }) => void;
  deleteProduct: (id: string) => void;
  updateProductOrder: (productId: string, newOrder: number) => void;
  toggleFeatured: (productId: string, isFeatured: boolean, tag?: string) => void;
  moveProductOrder: (productId: string, direction: "up" | "down") => void;
  resetToDefault: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetCategoriesToDefault: () => void;
  exportCategoriesJSON: () => string;
  importCategoriesJSON: (jsonString: string) => boolean;
  getProductsByCategoryId: (categoryId: string) => Product[];
  getCategoryIdByProductId: (productId: string) => string | undefined;
  setCategoryProducts: (categoryId: string, productIds: string[]) => void;
  assignProductToCategory: (productId: string, categoryId: string) => void;
  removeProductFromCategory: (productId: string, categoryId: string) => void;
  exportCategoryProductsJSON: () => string;
  importCategoryProductsJSON: (jsonString: string) => boolean;
  resetCategoryProductsToDefault: () => void;
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: (limit?: number) => Product[];
}

const ProductDataContext = createContext<ProductContextType | undefined>(undefined);

export function ProductDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [categoryProducts, setCategoryProductsState] = useState<CategoryProductMapping[]>(DEFAULT_CATEGORY_PRODUCTS);
  const [orders, setOrders] = useState<ProductOrder[]>(DEFAULT_ORDER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      const savedCategories = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      const savedCategoryProducts = localStorage.getItem(STORAGE_CATEGORY_PRODUCTS_KEY);
      const savedOrders = localStorage.getItem(STORAGE_ORDER_KEY);

      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedCategoryProducts) setCategoryProductsState(JSON.parse(savedCategoryProducts));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  const persistProducts = (newProducts: Product[], newOrders: ProductOrder[]) => {
    setProducts(newProducts);
    setOrders(newOrders);
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(newProducts));
      localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  };

  const persistCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    try {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(newCategories));
    } catch (e) {
      console.error("Failed to save categories to localStorage", e);
    }
  };

  const persistCategoryProducts = (newCategoryProducts: CategoryProductMapping[]) => {
    setCategoryProductsState(newCategoryProducts);
    try {
      localStorage.setItem(STORAGE_CATEGORY_PRODUCTS_KEY, JSON.stringify(newCategoryProducts));
    } catch (e) {
      console.error("Failed to save category-products to localStorage", e);
    }
  };

  // --- Product CRUD ---
  const addProduct = (item: Omit<Product, "id"> & { id?: string; order?: number; categoryId?: string }) => {
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

    persistProducts(newProducts, newOrders);

    if (item.categoryId) {
      assignProductToCategory(nextId, item.categoryId);
    }
  };

  const updateProduct = (id: string, updated: Partial<Product> & { order?: number; categoryId?: string }) => {
    const newProducts = products.map((p) => (p.id === id ? { ...p, ...updated } : p));
    let newOrders = [...orders];

    if (updated.order !== undefined) {
      const existing = newOrders.find((o) => o.productId === id);
      if (existing) {
        newOrders = newOrders.map((o) => (o.productId === id ? { ...o, order: updated.order! } : o));
      } else {
        newOrders.push({ productId: id, order: updated.order });
      }
    }

    persistProducts(newProducts, newOrders);

    if (updated.categoryId !== undefined) {
      const remaining = categoryProducts.filter((cp) => cp.productId !== id);
      if (updated.categoryId) {
        persistCategoryProducts([...remaining, { categoryId: updated.categoryId, productId: id }]);
      } else {
        persistCategoryProducts(remaining);
      }
    }
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter((p) => p.id !== id);
    const newOrders = orders.filter((o) => o.productId !== id);
    const newCategoryProducts = categoryProducts.filter((cp) => cp.productId !== id);
    persistProducts(newProducts, newOrders);
    persistCategoryProducts(newCategoryProducts);
  };

  const updateProductOrder = (productId: string, newOrder: number) => {
    const existing = orders.find((o) => o.productId === productId);
    let newOrders: ProductOrder[];
    if (existing) {
      newOrders = orders.map((o) => (o.productId === productId ? { ...o, order: newOrder } : o));
    } else {
      newOrders = [...orders, { productId, order: newOrder }];
    }
    persistProducts(products, newOrders);
  };

  const toggleFeatured = (productId: string, isFeatured: boolean, defaultTag = "Bán chạy") => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    if (isFeatured) {
      updateProduct(productId, { tag: target.tag || defaultTag });
    } else {
      updateProduct(productId, { tag: undefined });
    }
  };

  const moveProductOrder = (productId: string, direction: "up" | "down") => {
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

    persistProducts(products, newOrders);
  };

  const resetToDefault = () => {
    persistProducts(DEFAULT_PRODUCTS, DEFAULT_ORDER);
    persistCategoryProducts(DEFAULT_CATEGORY_PRODUCTS);
  };

  const exportJSON = () => {
    return JSON.stringify(products, null, 2);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return false;
      
      const newOrders: ProductOrder[] = parsed.map((p: Product, idx: number) => ({
        productId: String(p.id),
        order: idx + 1,
      }));

      persistProducts(parsed, newOrders);
      return true;
    } catch {
      return false;
    }
  };

  // --- Category CRUD ---
  const addCategory = (category: Category) => {
    const newCategories = [...categories, category];
    persistCategories(newCategories);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    const newCategories = categories.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat));
    persistCategories(newCategories);
  };

  const deleteCategory = (id: string) => {
    const newCategories = categories.filter((cat) => cat.id !== id);
    const newCategoryProducts = categoryProducts.filter((cp) => cp.categoryId !== id);
    persistCategories(newCategories);
    persistCategoryProducts(newCategoryProducts);
  };

  const resetCategoriesToDefault = () => {
    persistCategories(DEFAULT_CATEGORIES);
    persistCategoryProducts(DEFAULT_CATEGORY_PRODUCTS);
  };

  const exportCategoriesJSON = () => {
    return JSON.stringify(categories, null, 2);
  };

  const importCategoriesJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return false;
      persistCategories(parsed);
      return true;
    } catch {
      return false;
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

  const setCategoryProducts = (categoryId: string, productIds: string[]) => {
    const targetId = categoryId.trim();
    const remaining = categoryProducts.filter((cp) => cp.categoryId !== targetId);
    const newMappings: CategoryProductMapping[] = productIds.map((pId) => ({
      categoryId: targetId,
      productId: pId,
    }));
    persistCategoryProducts([...remaining, ...newMappings]);
  };

  const assignProductToCategory = (productId: string, categoryId: string) => {
    const exists = categoryProducts.some(
      (cp) => cp.productId === productId && cp.categoryId === categoryId
    );
    if (!exists) {
      persistCategoryProducts([...categoryProducts, { categoryId, productId }]);
    }
  };

  const removeProductFromCategory = (productId: string, categoryId: string) => {
    const updated = categoryProducts.filter(
      (cp) => !(cp.productId === productId && cp.categoryId === categoryId)
    );
    persistCategoryProducts(updated);
  };

  const exportCategoryProductsJSON = () => {
    return JSON.stringify(categoryProducts, null, 2);
  };

  const importCategoryProductsJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return false;
      persistCategoryProducts(parsed);
      return true;
    } catch {
      return false;
    }
  };

  const resetCategoryProductsToDefault = () => {
    persistCategoryProducts(DEFAULT_CATEGORY_PRODUCTS);
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
