"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { ButtonLink } from "@/components/common/buttons/button-link";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { Title } from "@/components/common/titles/Title";
import { useRouter } from "next/navigation";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { cashRegisterClosureCloseCashRegister } from "@/actions/cash-register-closure/mutations/cash-register-closure.close-cash-register.action";

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
    amountRef.current?.focus();
  }, [isOpenForm]);

  useEffect(() => {
    setDifference(-amountInRegister);
  }, [amountInRegister]);

  const handleCloseRegister = async () => {
    setIsPending(false);
    setIsOpenForm(true);
  };

  const handleCloseShift = async () => {
    if ( isPending ) return
    setIsPending(true);
    const resp = await cashRegisterClosureCloseCashRegister(
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

  if ( amountInRegister < 0 ) {
    return (
      <ShowPageMessage
        customMessage={`Registro de efectivo en caja es negativo (${(Math.round(amountInRegister*100)/100).toFixed(2)}). Corrija en ingreso de dinero a caja.`}
      />
    );
  }

  return (
    <>
      <ButtonSave
        isPending={isPending}
        handleOnClick={handleCloseRegister}
        label="Cerrar Caja"
        pendingLabel="Cerrando..."
      />

      {isOpenForm && (
        <div className="fixed inset-0 bg-background opacity-95 z-10 flex justify-center items-center top-16">
          <div className="fixed bg-background border  shadow-lg rounded-lg z-50 w-[95%] md:w-[60%] h-[80%] overflow-y-auto flex flex-col items-center gap-5">
            <ButtonLink
              handleAction={() => setIsOpenForm(false)}
              label="Volver"
            />
            <Title label="Efectivo esperado en Caja:" />
            <Title label={`S/. ${amountInRegister.toFixed(2)}`} />
            <h2>Cuánto de efectivo hay en casa física?</h2>
            <Input
              className="border border-gray-400 text-center w-[80%] md:w-[50%]"
              type="number"
              ref={amountRef}
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
            <p>Diferencia: S/. {difference.toFixed(2)}</p>
            <ButtonSave
              isPending={isPending}
              handleOnClick={handleCloseShift}
              label="CERRAR TURNO"
              pendingLabel="Cerrando..."
            />
            {difference < 0 && (
              <p className="text-red-500 font-bold w-[80%] md:w-1/2 text-center">
                La diferencia será registrada en su turno y será enviada a
                Genencia
              </p>
            )}
            {difference >= 0 && (
              <p className="text-green-500 font-bold w-[80%] md:w-1/2 text-center">
                Monto cuadra con lo registrado en Caja.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
