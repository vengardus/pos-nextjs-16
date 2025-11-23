"use client";

import { useCartStore } from "@/stores/cart/cart.store";

export const PosCashRegister = () => {
  const cashRegisterOpen = useCartStore((state) => state.cashRegisterOpen);
  return (
    <>
      <span>Sucursal: </span>
      <span className="text-lg ml-2">{`${cashRegisterOpen?.branchName} - ${cashRegisterOpen?.description}`}</span>
    </>
  );
};
