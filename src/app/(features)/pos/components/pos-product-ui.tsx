"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/tailwind/cn";
import { Barcode, Keyboard } from "lucide-react";
import type { Product } from "@/server/modules/product/domain/product.interface";
import { useCartProdut } from "@/app/(features)/pos/hooks/use-cart-product";
import { useCartStore } from "@/stores/cart/cart.store";
import { ButtonIcon } from "@/components/common/buttons/button-icon";
import { Combobox } from "@/components/common/combobox/combobox";
import { PosSearch } from "./pos-header/pos-search";
import { useProductStore } from "@/stores/product/product.store";
import { useRouter } from "next/navigation";

const classNameInputMode = "bg-[#5849fe] text-white hover:bg-indigo-700";

interface PosProductUIProps {
  products: Product[];
}
export const PosProductUI = ({ products }: PosProductUIProps) => {
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

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row md:items-center gap-2 md:gap-7">
        <div className="w-full md:w-1/2">
          <PosSearch
            handleOnChange={() => {}}
            handleOnKeyDownEnter={handleOnKeyDownEnterSearch}
            searchRef={searchRef}
          />
        </div>
        <div className="flex gap-3">
          <ButtonIcon
            label={"Lectora"}
            handleClick={() => {
                setIsKeyboardMode(false);
                setIsBarcode(!isBarcode)
            }}
            className={cn("w-1/3 md:w-auto md:px-10", {
              [classNameInputMode]: !isKeyboardMode,
            })}
          >
            <Barcode />
          </ButtonIcon>

          <ButtonIcon
            label={"Teclado"}
            handleClick={() => {
              setIsKeyboardMode(true);
              setIsOpenCombobox(!isOpenCombobox);
            }}
            className={cn("w-1/3 md:w-auto md:px-10 ", {
              [classNameInputMode]: isKeyboardMode,
            })}
          >
            <Keyboard />
          </ButtonIcon>
        </div>
      </div>

      {isKeyboardMode && (
        <Combobox
          data={products.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          handleSelect={(value) => handleSelectProduct(value)}
          labelSelect="Seleccione un producto"
          isOpen={isOpenCombobox}
          setIsOpen={setIsOpenCombobox}
          notFound={
            <div className="flex flex-col gap-2">
              <p>Producto no encontrado</p>
              <button
                className="underline underline-offset-4 hover:cursor-pointer   hover:text-blue-300"
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
