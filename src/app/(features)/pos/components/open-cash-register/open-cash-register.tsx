import { useEffect, useRef, useState } from "react";

import { Input } from "../../../../../components/ui/input";

import type { CashRegisterClosure } from "@/types/interfaces/cash-register-closure/cash-register-closure.interface";
import type { CashRegisterDecision } from "@/types/interfaces/cash-register/cash-register-decision.interface";
import { CashRegisterStatusEnum } from "@/types/enums/cash-register-status.enum";
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
    <div className="flex h-full">
      {/* Panel izquierdo: selección de caja */}
      <aside className="w-1/3 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-medium mb-2">Selecciona una caja</h2>
        <h1>{cashRegisterDecision.type}</h1>
        <ul>
          {cashRegisterDecision.cashRegisters.map((cr) => (
            <li
              key={cr.id}
              className={`
                flex flex-col p-2 mb-2 rounded cursor-pointer
                ${
                  selectedCashRegister?.id === cr.id
                    ? "bg-gray-100 text-background"
                    : "hover:bg-gray-400"
                }
              `}
              onClick={() => setSelectedCashRegister(cr)}
            >
              <span className="font-semibold">{cr.branchName}</span>
              <span className="text-sm">{cr.description}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Panel derecho: formulario */}
      <main className="w-2/3 p-4">
        {selectedCashRegister ? (
          <section className="flex flex-col gap-5 items-center">
            <h1>
              Aperturar Caja:{" "}
              <span className="font-semibold">
                {selectedCashRegister.branchName} – {selectedCashRegister.description}
              </span>
            </h1>
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <Input
                type="number"
                ref={amountRef}
                className="w-[200px] text-right border border-gray-300 rounded-xl px-3 h-12"
              />
              <span className="text-red-500">{messageError}</span>
              <ButtonSave isPending={isPending} label="Aperturar" pendingLabel="Aperturando..." />
            </form>
          </section>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Por favor selecciona una caja en el panel izquierdo.
          </div>
        )}
      </main>
    </div>
  );
};
