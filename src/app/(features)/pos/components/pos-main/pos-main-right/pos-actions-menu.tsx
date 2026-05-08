"use client";

import { CashRegisterMovementTypeEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-type.enum";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart/cart.store";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Power, 
  MoreVertical 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const PosActionsMenu = () => {
  const router = useRouter();
  const cashRegisterOpen = useCartStore((state) => state.cashRegisterOpen);

  const handleRegisterMovement = (type: CashRegisterMovementTypeEnum) => {
    router.push(`/cash-register/movement/${type}`);
  };
  
  const handleRegisterClosure = () => {
    router.push(`/cash-register/closure/${cashRegisterOpen?.cashRegisterClosureId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-white/10">
        <DropdownMenuItem onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.INCOME)} className="text-zinc-300 hover:text-emerald-400 cursor-pointer">
          <ArrowUpCircle className="w-4 h-4 mr-2 text-emerald-400" /> Ingresar Dinero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.EXPENSE)} className="text-zinc-300 hover:text-amber-400 cursor-pointer">
          <ArrowDownCircle className="w-4 h-4 mr-2 text-amber-400" /> Retirar Dinero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRegisterClosure} className="text-zinc-300 hover:text-red-400 cursor-pointer">
          <Power className="w-4 h-4 mr-2 text-red-400" /> Cerrar Caja
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
