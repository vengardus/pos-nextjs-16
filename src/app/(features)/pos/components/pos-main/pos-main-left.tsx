"use client";

import { Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart/cart.store";
import { CartProduct } from "@/server/modules/sale/domain/cart-product.interface";
import { ButtonAddSubCartItem } from "@/components/common/buttons/buitton-add-sub-cart-item";
import { cn } from "@/utils/tailwind/cn";

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
    <section className="flex flex-col h-full max-h-[60vh] lg:max-h-[70vh]">
      {/* Header */}
      <div className="grid grid-cols-5 text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-900/50 py-3 px-4 border-b border-white/5 shrink-0">
        <span>Producto</span>
        <span className="text-center">Cant.</span>
        <span className="text-center">Precio</span>
        <span className="text-center">Total</span>
        <span className="text-center">Acción</span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {cart.length === 0 && (
          <div className="flex justify-center items-center h-full text-zinc-500 text-sm italic">
            No hay items en el carrito
          </div>
        )}
        {cart.map((item) => (
          <div 
            className="grid grid-cols-5 items-center px-2 py-3 rounded-lg hover:bg-white/5 transition-colors duration-200" 
            key={item.id}
          >
            <p className="text-left font-medium text-zinc-100">{item.name}</p>
            <div className="flex justify-center gap-x-3 items-center">
              <ButtonAddSubCartItem type="sub" item={item} action={handleClickAddSub} /> 
              <p className="font-mono text-zinc-200 w-6 text-center">{item.quantity}</p>
              <ButtonAddSubCartItem type="add" item={item} action={handleClickAddSub} /> 
            </div>
            <p className="text-center font-mono text-zinc-300">{item.price.toFixed(2)}</p>
            <p className="text-center font-bold font-mono text-indigo-400">{item.total.toFixed(2)}</p>
            <div className="flex justify-center">
              <Trash2
                className="w-5 h-5 text-zinc-500 hover:text-red-500 cursor-pointer transition-colors"
                onClick={() => removeProduct(item.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
