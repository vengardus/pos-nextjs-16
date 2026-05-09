"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cart/cart.store";
import { PosMainTotalsButton } from "./pos-main-totals-button";
import { PosActionsMenu } from "./pos-actions-menu";

export const PosMainTotals = () => {
  const [mounted, setMounted] = useState(false);
  const { getSummaryCart } = useCartStore();
  const { subTotal, tax, total } = getSummaryCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between p-4 bg-zinc-900/30">
      <div className="space-y-4">
        {/* Header con Acciones */}
        <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-zinc-100">Resumen</span>
            <PosActionsMenu />
        </div>
        
        {/* Detalles */}
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">SubTotal</span>
            <span className="font-mono text-zinc-400">S/. {mounted ? subTotal.toFixed(2) : "0.00"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">IGV (18%)</span>
            <span className="font-mono text-zinc-400">S/. {mounted ? tax.toFixed(2) : "0.00"}</span>
            </div>
        </div>
        <div className="h-px bg-white/5" />
      </div>
      
      <PosMainTotalsButton total={mounted ? total : 0} />
    </div>
  );
};
