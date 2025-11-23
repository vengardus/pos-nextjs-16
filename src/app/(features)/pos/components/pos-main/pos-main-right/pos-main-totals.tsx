"use client";

import { useCartStore } from "@/stores/cart/cart.store";
import { PosMainTotalsButton } from "./pos-main-totals-button";

export const PosMainTotals = () => {
  const { getSummaryCart } = useCartStore();
  const { subTotal, tax, total } = getSummaryCart();

  return (
    <div className="flex flex-col mt-auto w-full px-2">
      <div className="grid grid-cols-2 gap-1 w-full px-1justify-items-end">
        <span>SubTotal</span>
        <span className="text-right">$ {subTotal.toFixed(2)}</span>
        <span>Igv(18%)</span>
        <span className="text-right">$ {tax.toFixed(2)}</span>
      </div>
      <PosMainTotalsButton total={total} />
    </div>
  );
};
