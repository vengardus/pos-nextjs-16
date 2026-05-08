"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";
import { useCartStore } from "@/stores/cart/cart.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind/cn";

interface PosMainTotalsButtonProps {
  total: number;
}

export const PosMainTotalsButton = ({ total }: PosMainTotalsButtonProps) => {
  const setIsOpenModalSalePayment = useCartStore(
    (state) => state.setIsOpenModalSalePayment
  );
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const getSummaryCart = useCartStore((state) => state.getSummaryCart);

  const handleSaveSale = async () => {
    if (getSummaryCart().totalItems <= 0) return;
    setPaymentMethod(PaymentMethodEnum.CASH);
    setIsOpenModalSalePayment(true);
  };

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-zinc-400">Total a pagar</span>
        <div className="text-3xl font-black font-mono text-indigo-400">
           S/. {total.toFixed(2) ?? "0.00"}
        </div>
      </div>
      
      <Button 
        onClick={handleSaveSale}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02]"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        PROCEDER AL COBRO
      </Button>
    </div>
  );
};
