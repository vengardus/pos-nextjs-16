"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/tailwind/cn";

import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { useRouter } from "next/navigation";
import { cashRegisterClosureCloseCashRegisterAction } from "@/server/modules/cash-register-closure/next/actions/cash-register-closure.close-cash-register.action";

import { AlertCircle, ArrowLeft, CheckCircle2, Coins } from "lucide-react";

interface RegisterClosureUIProps {
  cashRegisterClosureId: string;
  amountInRegister: number;
  paymentMethods: PaymentMethod[];
}
export const RegisterClosureUI = ({
  cashRegisterClosureId,
  amountInRegister,
  paymentMethods,
}: RegisterClosureUIProps) => {
  const [isPending, setIsPending] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [difference, setDifference] = useState(0);
  const router = useRouter()
  const amountRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpenForm) {
      setTimeout(() => amountRef.current?.focus(), 100);
    }
  }, [isOpenForm]);

  useEffect(() => {
    setDifference(-amountInRegister);
  }, [amountInRegister]);

  const handleCloseRegister = async () => {
    console.log("handleCloseRegister called, opening form");
    setIsPending(false);
    setIsOpenForm(true);
  };

  const handleCloseShift = async () => {
    if ( isPending ) return
    setIsPending(true);
    const resp = await cashRegisterClosureCloseCashRegisterAction(
      cashRegisterClosureId,
      amountInRegister,
      parseFloat(amountRef.current?.value || "0"),
      paymentMethods
    );
    if (!resp.success) {
      setIsPending(false);
      toast.error("Error al cerrar caja: ", { description: resp.message });
      return;
    }
    toast.success("Caja ha sido cerrada correctamente");
    router.push("/pos")
  };

  if ( amountInRegister < 0 ) return null;

  return (
    <>
      <ButtonSave
        isPending={isPending}
        handleOnClick={handleCloseRegister}
        label="Proceder al Cierre"
        pendingLabel="Cerrando..."
        className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      />

      {isOpenForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[2000] flex justify-center items-center p-4">
          <div className="bg-background border border-border shadow-2xl rounded-2xl z-[2001] w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Coins size={20} />
                </div>
                <h3 className="font-bold text-lg">Cuadre de Efectivo</h3>
              </div>
              <button 
                onClick={() => setIsOpenForm(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Efectivo esperado en Caja</p>
                <p className="text-4xl font-black tracking-tight text-foreground">S/. {amountInRegister.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>¿Cuánto efectivo hay en caja física?</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">S/.</span>
                  <Input
                    className="pl-12 h-16 text-2xl font-bold border-2 focus-visible:ring-primary/20 transition-all"
                    type="number"
                    ref={amountRef}
                    placeholder="0.00"
                    onChange={(e) => {
                      const value = e.target.value;
                      setDifference(
                        parseFloat(value.trim().length ? value : "0") -
                          amountInRegister
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCloseShift();
                      }
                    }}
                  />
                </div>
              </div>

              <div className={cn(
                "p-5 rounded-xl border flex items-center gap-4 transition-colors",
                difference < 0 
                  ? "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30" 
                  : "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30"
              )}>
                <div className={cn(
                  "p-2 rounded-full",
                  difference < 0 ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40"
                )}>
                  {difference < 0 ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-0.5">Diferencia</p>
                  <p className={cn("text-xl font-bold", difference < 0 ? "text-rose-600" : "text-emerald-600")}>
                    S/. {difference.toFixed(2)}
                  </p>
                </div>
              </div>

              {difference < 0 && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium text-center leading-relaxed bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-100 dark:border-rose-900/20">
                  ⚠️ La diferencia negativa será registrada en su turno y notificada a gerencia.
                </p>
              )}
            </div>

            <div className="p-6 bg-muted/30 border-t border-border/40">
              <ButtonSave
                isPending={isPending}
                handleOnClick={handleCloseShift}
                label="CONFIRMAR Y CERRAR TURNO"
                pendingLabel="Cerrando..."
                className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
