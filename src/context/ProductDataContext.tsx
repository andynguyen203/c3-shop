"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS as DEFAULT_PRODUCTS, Product } from "@/data/products";
import { FEATURED_PRODUCT_ORDER as DEFAULT_ORDER, ProductOrder } from "@/data/order";

const STORAGE_PRODUCTS_KEY = "japan_shop_products_v1";
const STORAGE_ORDER_KEY = "japan_shop_order_v1";

interface ProductContextType {
  products: Product[];
  orders: ProductOrder[];
  isLoaded: boolean;
  addProduct: (product: Omit<Product, "id"> & { id?: string; order?: number }) => void;
  updateProduct: (id: string, updated: Partial<Product> & { order?: number }) => void;
  deleteProduct: (id: string) => void;
  updateProductOrder: (productId: string, newOrder: number) => void;
  resetToDefault: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategoryId: (categoryId: string) => Product[];
  getFeaturedProducts: (limit?: number) => Product[];
}

const ProductDataContext = createContext<ProductContextType | undefined>(undefined);

export function ProductDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState<ProductOrder[]>(DEFAULT_ORDER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      const savedOrders = localStorage.getItem(STORAGE_ORDER_KEY);

      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.error("Failed to load products from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes (after initial mount)
  const persist = (newProducts: Product[], newOrders: ProductOrder[]) => {
    setProducts(newProducts);
    setOrders(newOrders);
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(newProducts));
      localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  };

  const addProduct = (item: Omit<Product, "id"> & { id?: string; order?: number }) => {
    const nextId = item.id?.trim() || String(Date.now());
    const newProduct: Product = {
      ...item,
      id: nextId,
      rating: item.rating ?? 5.0,
      reviews: item.reviews ?? 0,
    };

    const nextOrder = item.order ?? (orders.length > 0 ? Math.max(...orders.map((o) => o.order)) + 1 : 1);
    const newOrders = [...orders, { productId: nextId, order: nextOrder }];
    const newProducts = [...products, newProduct];

    persist(newProducts, newOrders);
  };

  const updateProduct = (id: string, updated: Partial<Product> & { order?: number }) => {
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

    persist(newProducts, newOrders);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter((p) => p.id !== id);
    const newOrders = orders.filter((o) => o.productId !== id);
    persist(newProducts, newOrders);
  };

  const updateProductOrder = (productId: string, newOrder: number) => {
    const existing = orders.find((o) => o.productId === productId);
    let newOrders: ProductOrder[];
    if (existing) {
      newOrders = orders.map((o) => (o.productId === productId ? { ...o, order: newOrder } : o));
    } else {
      newOrders = [...orders, { productId, order: newOrder }];
    }
    persist(products, newOrders);
  };

  const resetToDefault = () => {
    persist(DEFAULT_PRODUCTS, DEFAULT_ORDER);
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

      persist(parsed, newOrders);
      return true;
    } catch {
      return false;
    }
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id || p.id.toLowerCase() === id.toLowerCase());
  };

  const getProductsByCategoryId = (categoryId: string) => {
    const target = categoryId.toLowerCase().trim();
    return products.filter((p) => p.categoryId.toLowerCase() === target);
  };

  const getFeaturedProducts = (limit?: number) => {
    const orderMap = new Map<string, number>(orders.map((o) => [o.productId, o.order]));

    const featured = [...products]
      .filter((p) => p.tag !== undefined || p.rating >= 4.7)
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
        orders,
        isLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductOrder,
        resetToDefault,
        exportJSON,
        importJSON,
        getProductById,
        getProductsByCategoryId,
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
