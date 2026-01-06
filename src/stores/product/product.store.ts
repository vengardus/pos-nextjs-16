import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/server/modules/product/domain/product.interface";

interface State {
  product: Product;
  products: Product[];
  setProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<State>()(
  persist(
    (set) => ({
      product: {} as Product,
      products: [],

      setProduct: (product: Product) => {
        set({ product });
      },

      setProducts: (products: Product[]) => {
        set({ products });
      },
    }),
    {
      name: "product-store",
    }
  )
);
