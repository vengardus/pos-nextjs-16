"use client";

import { CashRegisterMovementTypeEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-type.enum";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart/cart.store";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Power, 
  MoreVertical,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export const PosActionsMenu = () => {
  const router = useRouter();
  const cashRegisterOpen = useCartStore((state) => state.cashRegisterOpen);
  const clearCart = useCartStore((state) => state.clearCart);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegisterMovement = (type: CashRegisterMovementTypeEnum) => {
    router.push(`/cash-register/movement/${type}`);
  };

  const handleRegisterClosure = () => {
    router.push(`/cash-register/closure/${cashRegisterOpen?.cashRegisterClosureId}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 gap-2 border-white/10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 dark:bg-white/90 dark:text-zinc-900">
            <MoreVertical className="h-4 w-4 md:hidden" />
            <span className="hidden md:inline p-2">ACCIONES</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-white/10 z-[100]">
          <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-zinc-300 hover:text-red-400 cursor-pointer text-md">
            <Trash2 className="w-4 h-4 mr-2" /> Limpiar Carrito
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.INCOME)} className="text-zinc-300 hover:text-emerald-400 cursor-pointer text-md">
            <ArrowUpCircle className="w-4 h-4 mr-2 text-emerald-400" /> Ingresar Dinero
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.EXPENSE)} className="text-zinc-300 hover:text-amber-400 cursor-pointer text-md">
            <ArrowDownCircle className="w-4 h-4 mr-2 text-amber-400" /> Retirar Dinero
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRegisterClosure} className="text-zinc-300 hover:text-red-400 cursor-pointer text-md">
            <Power className="w-4 h-4 mr-2 text-red-400" /> Cerrar Caja
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm} modal={false}>
        <DialogContent className="bg-zinc-900 border-white/10" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-zinc-100">¿Estás seguro?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Esta acción eliminará todos los productos del carrito de forma irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="bg-zinc-800 border-white/10 text-zinc-300 hover:bg-zinc-700">Cancelar</Button>
            <Button onClick={() => {
              clearCart();
              setShowConfirm(false);
            }} className="bg-red-600 hover:bg-red-700 text-white">Limpiar Carrito</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
