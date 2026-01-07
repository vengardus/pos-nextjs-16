"use client";

import { Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart/cart.store";
import { CartProduct } from "@/server/modules/sale/domain/cart-product.interface";
import { ButtonAddSubCartItem } from "@/components/common/buttons/buitton-add-sub-cart-item";

export const PosMainLeft = () => {
  const cart = useCartStore((state) => state.cart);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const updateProductQuantity = useCartStore((state) => state.updateProductQuantity);

  const handleClickAddSub = (item:CartProduct, type: "add" | "sub") => {
    const newQuantity = type === "add" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity > 0) updateProductQuantity(item, newQuantity);
    else removeProduct(item.id);
  };

  return (
    <section className="flex flex-col gap-2 mt-2 mb-5 mx-2">
      <div className="grid grid-cols-5 font-bold bg-surfaceContrast py-1 text-center text-foreground">
        <span>Producto</span>
        <span>Cant.</span>
        <span>Precio</span>
        <span>Total</span>
        <span>Acción</span>
      </div>
      {cart.length === 0 && (
        <div className="flex justify-center w-full">
          <div className="text-muted-foreground flex justify-center w-1/3 text-md">No hay items</div>
        </div>
      )}
      {cart.map((item) => (
        <div className="grid grid-cols-5 text-center items-center" key={item.id}>
          <p className="text-left">{item.name}</p>
          <div className="flex justify-center gap-x-3 items-center">
            <ButtonAddSubCartItem type="sub" item={item} action={handleClickAddSub} /> 
            <p>{item.quantity}</p>
            <ButtonAddSubCartItem type="add" item={item} action={handleClickAddSub} /> 
          </div>
          <p>{item.price.toFixed(2)}</p>
          <p>{item.total.toFixed(2)}</p>
          <Trash2
            className="w-6 h-5 text-danger justify-self-center"
            onClick={() => {
              removeProduct(item.id);
            }}
          />
        </div>
      ))}
    </section>
  );
};
