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
import { useEffect, useState } from "react";

export const PosActionsMenu = () => {
  const router = useRouter();
  const cashRegisterOpen = useCartStore((state) => state.cashRegisterOpen);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingClearCartConfirm, setPendingClearCartConfirm] = useState(false);

  useEffect(() => {
    if (!isActionsMenuOpen && pendingClearCartConfirm) {
      setShowConfirm(true);
      setPendingClearCartConfirm(false);
    }
  }, [isActionsMenuOpen, pendingClearCartConfirm]);

  const handleRegisterMovement = (type: CashRegisterMovementTypeEnum) => {
    router.push(`/cash-register/movement/${type}`);
  };

  const handleRegisterClosure = () => {
    router.push(`/cash-register/closure/${cashRegisterOpen?.cashRegisterClosureId}`);
  };

  return (
    <>
      <DropdownMenu open={isActionsMenuOpen} onOpenChange={setIsActionsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 gap-2 border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800">
            <MoreVertical className="h-4 w-4 md:hidden" />
            <span className="hidden md:inline p-2">ACCIONES</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 z-[100]">
          <DropdownMenuItem 
            onSelect={() => {
              setIsActionsMenuOpen(false);
              setPendingClearCartConfirm(true);
            }} 
            className="text-slate-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 cursor-pointer text-md font-medium"
          >
            <Trash2 className="w-4 h-4 mr-2 text-rose-500" /> Limpiar Carrito
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.INCOME)} className="text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer text-md font-medium">
            <ArrowUpCircle className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" /> Ingresar Dinero
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRegisterMovement(CashRegisterMovementTypeEnum.EXPENSE)} className="text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer text-md font-medium">
            <ArrowDownCircle className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" /> Retirar Dinero
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRegisterClosure} className="text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-red-400 cursor-pointer text-md font-medium">
            <Power className="w-4 h-4 mr-2 text-rose-500 dark:text-red-400" /> Cerrar Caja
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">¿Estás seguro?</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Esta acción eliminará todos los productos del carrito de forma irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800">Cancelar</Button>
            <Button onClick={() => {
              clearCart();
              setShowConfirm(false);
            }} className="bg-rose-600 hover:bg-rose-700 text-white">Limpiar Carrito</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
