"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/tailwind/cn";
import { Barcode, Keyboard } from "lucide-react";
import type { Product } from "@/server/modules/product/domain/product.interface";
import { useCartProdut } from "@/app/(features)/pos/hooks/use-cart-product";
import { useCartStore } from "@/stores/cart/cart.store";
import { ComboboxSearch } from "@/components/common/combobox/combobox-search";
import { PosSearch } from "./pos-header/pos-search";
import { useProductStore } from "@/stores/product/product.store";
import { useRouter } from "next/navigation";
import { productSearchAction } from "@/server/modules/product/next/actions/product.search.action";

interface PosProductUIProps {
  products: Product[];
  companyId: string;
}
export const PosProductUI = ({ products, companyId }: PosProductUIProps) => {
  //const [products, setProducts] = useState<Product[]>([]);
  const [isOpenCombobox, setIsOpenCombobox] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const isKeyboardMode = useCartStore((state) => state.isKeyboardMode);
  const setIsKeyboardMode = useCartStore((state) => state.setIsKeyboardMode);
  const [isBarcode, setIsBarcode] = useState(!isKeyboardMode);
  const setProducts = useProductStore((state) => state.setProducts);
  // const products = useProductStore((state) => state.products);
  const { handleSelectProduct, handleOnKeyDownEnterSearch } = useCartProdut();
  const router = useRouter();

  useEffect(() => {
    // if (!isKeyboardMode) searchRef.current?.focus();
    if (!isKeyboardMode) searchRef.current?.focus();
  }, [isBarcode, isKeyboardMode]);

  useEffect(() => {
    if (products) setProducts(products);
  }, [products, setProducts]);

  const handleSearch = async (query: string) => {
    const resp = await productSearchAction(companyId, query);
    if (resp.success && resp.data) {
      const foundProducts = resp.data as Product[];
      
      // Merge found products into the store to make them selectable
      const existingProducts = useProductStore.getState().products;
      const allProductsMap = new Map();
      existingProducts.forEach(p => allProductsMap.set(p.id, p));
      foundProducts.forEach(p => allProductsMap.set(p.id, p));
      
      setProducts(Array.from(allProductsMap.values()));

      return foundProducts.map((product) => ({
        label: product.name,
        value: product.id,
      }));
    }
    return [];
  };

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row md:items-center gap-4">
        <div className="w-full md:w-1/2">
          <PosSearch
            handleOnChange={() => {}}
            handleOnKeyDownEnter={handleOnKeyDownEnterSearch}
            searchRef={searchRef}
          />
        </div>
        
        {/* Modern Segmented Control */}
        <div className="flex bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => {
                setIsKeyboardMode(false);
                setIsBarcode(!isBarcode)
            }}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              !isKeyboardMode ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            )}
          >
            <Barcode className="w-4 h-4" />
            Lectora
          </button>
          <button
            onClick={() => {
              setIsKeyboardMode(true);
              setIsOpenCombobox(!isOpenCombobox);
            }}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              isKeyboardMode ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            )}
          >
            <Keyboard className="w-4 h-4" />
            Teclado
          </button>
        </div>
      </div>

      {isKeyboardMode && (
        <ComboboxSearch
          initialData={products.map((p) => ({ label: p.name, value: p.id }))}
          onSearch={handleSearch}
          handleSelect={(value) => handleSelectProduct(value)}
          labelSelect="Seleccione un producto"
          isOpen={isOpenCombobox}
          setIsOpen={setIsOpenCombobox}
          classNameButton="w-full bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100"
          classNameList="w-full bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10"
          notFound={
            <div className="flex flex-col gap-2 p-4 text-slate-500 dark:text-zinc-400">
              <p>Producto no encontrado</p>
              <button
                className="underline underline-offset-4 hover:cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={() => router.push("/config/products")}
              >
                Ir a crear productos
              </button>
            </div>
          }
        />
      )}
    </>
  );
};
