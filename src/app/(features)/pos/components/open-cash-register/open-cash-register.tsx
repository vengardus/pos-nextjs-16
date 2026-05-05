import { useEffect, useRef, useState } from "react";

import { Input } from "../../../../../components/ui/input";

import type { CashRegisterClosure } from "@/server/modules/cash-register-closure/domain/cash-register-closure.types";
import type { CashRegisterDecision } from "@/server/modules/cash-register/domain/cash-register.types";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import { useCashRegisterDecisionStore } from "@/stores/cash-register/cash-register-decision.store";
import { usePaymentMethodStore } from "@/stores/payment-method/payment-method.store";
import { useUserStore } from "@/stores/user/user.store";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { cashRegisterClosureInsertAction } from "@/server/modules/cash-register-closure/next/actions/cash-register-closure.insert.action";

interface OpenRegisterProps {
  isOpenOpenRegisterModal: boolean;
}

export const OpenCashRegister = ({
  isOpenOpenRegisterModal,
}: OpenRegisterProps) => {
  const [messageError, setMessageError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  // Estado local para la selección de caja
  const [selectedCashRegister, setSelectedCashRegister] = useState<
    CashRegisterDecision["cashRegisters"][number] | null
  >(null);

  const paymentMethods = usePaymentMethodStore((state) => state.paymentMethods);
  const currentUser = useUserStore((state) => state.currentUser);
  const cashRegisterDecision = useCashRegisterDecisionStore((state) => state.cashRegisterDecision);

  useEffect(() => {
    if (isOpenOpenRegisterModal && amountRef.current) {
      amountRef.current.value = "0";
      const timer = setTimeout(() => {
        amountRef.current?.select();
        amountRef.current?.focus();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpenOpenRegisterModal, selectedCashRegister]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!amountRef.current || !selectedCashRegister || isPending) {
      return;
    }
    const amount = parseFloat(amountRef.current!.value);

    if (isNaN(amount)) {
      setMessageError("Ingrese un monto válido.");
      return;
    }
    // setIsPending(true);

    const registerClosure: CashRegisterClosure = {
      id: "",
      initialCash: amount,
      status: CashRegisterStatusEnum.OPENING,
      userId: currentUser.id,
      cashRegisterId: selectedCashRegister.id,
    };

    try {
      const resp = await cashRegisterClosureInsertAction(
        registerClosure,
        paymentMethods
      );
      if (!resp.success) {
        setMessageError(`Ocurrió un error al aperturar: ${resp.message}`);
        return;
      }
      setIsPending(false);
      console.log("Apertura de caja exitosa!!!!");
    } catch (error) {
      setMessageError(`Error al aperturar caja: ${error}`);
    } 
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Selecciona una caja</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cashRegisterDecision.cashRegisters.map((cr) => (
            <div
              key={cr.id}
              className={`
                cursor-pointer rounded-xl border p-4 transition-all duration-200
                ${
                  selectedCashRegister?.id === cr.id
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                }
              `}
              onClick={() => setSelectedCashRegister(cr)}
            >
              <p className="font-semibold text-foreground">{cr.branchName}</p>
              <p className="text-sm text-muted-foreground">{cr.description}</p>
            </div>
          ))}
        </div>
      </section>

      {selectedCashRegister && (
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Apertura: {selectedCashRegister.description}
          </h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-sm">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Monto Inicial
              </label>
              <Input
                type="number"
                ref={amountRef}
                className="h-12 text-lg rounded-xl"
                placeholder="0.00"
              />
            </div>
            {messageError && <p className="text-sm text-destructive">{messageError}</p>}
            <ButtonSave
              isPending={isPending}
              label="Confirmar Apertura"
              pendingLabel="Procesando..."
              className="h-12 rounded-xl"
            />
          </form>
        </section>
      )}
    </div>
  );
};
