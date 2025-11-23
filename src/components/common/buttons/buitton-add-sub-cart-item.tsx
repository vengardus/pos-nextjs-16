"use client";

import { CartProduct } from "@/types/interfaces/sales/cart-product.interface";
import { cn } from "@/utils/tailwind/cn";

type actionType = "add" | "sub";
interface ButtonAddSubProps {
  type: actionType;
  item: CartProduct;
  action: (item: CartProduct, type: actionType) => void;
}
export const ButtonAddSubCartItem = ({ type, item, action }: ButtonAddSubProps) => {
  return (
    <div
      className={cn("cursor pointer border-2 border-foreground/10 w-[2rem] text-xl", {
        "hover:bg-green-500": type === "add",
        "hover:bg-red-500": type === "sub",
      })}
      onClick={() => {
        action(item, type);
      }}
    >
      {type === "sub" ? "-" : "+"}
    </div>
  );
};
