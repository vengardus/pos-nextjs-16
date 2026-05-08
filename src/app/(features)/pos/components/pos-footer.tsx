"use client";

import { CashRegisterMovementTypeEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-type.enum";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart/cart.store";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Power, Trash2, X } from "lucide-react";

export const PosFooter = () => {
  const router = useRouter();
  const cashRegisterOpen = useCartStore((state) => state.cashRegisterOpen);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleRegisterMovement = (type: CashRegisterMovementTypeEnum) => {
    router.push(`/cash-register/movement/${type}`);
  };
  
  const handleRegisterClosure = () => {
    router.push(`/cash-register/closure/${cashRegisterOpen?.cashRegisterClosureId}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" className="text-zinc-400 hover:text-red-400" onClick={() => clearCart()}>
        <Trash2 className="w-4 h-4 mr-2" /> Limpiar
      </Button>
      
      <div className="h-6 w-px bg-white/10 mx-2" />

      <Button variant="outline" className="border-white/10 text-zinc-300 hover:bg-zinc-800" onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.INCOME)}>
        <ArrowUpCircle className="w-4 h-4 mr-2 text-emerald-400" /> Ingresar
      </Button>
      <Button variant="outline" className="border-white/10 text-zinc-300 hover:bg-zinc-800" onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.EXPENSE)}>
        <ArrowDownCircle className="w-4 h-4 mr-2 text-amber-400" /> Retirar
      </Button>
      <Button variant="outline" className="border-white/10 text-zinc-300 hover:bg-zinc-800" onClick={handleRegisterClosure}>
        <Power className="w-4 h-4 mr-2 text-red-400" /> Cerrar Caja
      </Button>

      <div className="ml-auto">
        <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100" onClick={() => router.push("/")}>
          <X className="w-4 h-4 mr-2" /> Salir
        </Button>
      </div>
    </div>
  );
};
