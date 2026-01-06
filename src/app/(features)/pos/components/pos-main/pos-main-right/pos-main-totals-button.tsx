"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";
import { useCartStore } from "@/stores/cart/cart.store";
import { ButtonSave } from "@/components/common/buttons/button-save";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { CashRegisterMovementTypeEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-type.enum";

const className = "h-14 w-32 text-md font-bold uppercase rounded-xl";

interface PosMainTotalsButtonProps {
  total: number;
}
export const PosMainTotalsButton = ({ total }: PosMainTotalsButtonProps) => {
  const [isPending] = useState(false);
  const setIsOpenModalSalePayment = useCartStore(
    (state) => state.setIsOpenModalSalePayment
  );
  const setPaymentMethod = useCartStore((set) => set.setPaymentMethod);
  const cashRegisterOpen = useCartStore(
    (state) => state.cashRegisterOpen
  );
  const getSummaryCart = useCartStore((state) => state.getSummaryCart);

  const handleSaveSale = async () => {
    if (getSummaryCart().totalItems <= 0) return;

    console.log("handleSaveSale");
    setPaymentMethod(PaymentMethodEnum.CASH);
    setIsOpenModalSalePayment(true);
  };

  return (
    <div className="flex flex-col gap-2 py-2 bg-[#3ff563] text-black mt-5 px-2 rounded-xl">
      <div
        onSubmit={handleSaveSale}
        className="flex gap-5 w-full justify-end lg:hidden"
      >
        <ButtonOptions cashRegisterClosureId={cashRegisterOpen.cashRegisterClosureId} />
        <ButtonSave
          isPending={isPending}
          label="Cobrar"
          handleOnClick={handleSaveSale}
          className={className}
        />
      </div>
      <div className="flex w-full gap-2  justify-between items-center">
        <DollarSign className="text-green-800 bg-[#3ff563] rounded-full size-20 " />
        <div className="flex gap-4">
          <span className="text-3xl">S/.</span>
          <span className="text-3xl ">{total.toFixed(2) ?? "0.00"}</span>
        </div>
      </div>
    </div>
  );
};

interface ButtonOptionsProps {
  cashRegisterClosureId: string;
}

const ButtonOptions = ({ cashRegisterClosureId }: ButtonOptionsProps) => {
  const handleRegisterMovement = (type: CashRegisterMovementTypeEnum) => {
    redirect(`/cash-register/movement/${type}`);
  };
  const handleRegisterClosure = () => {
    redirect(`/cash-register/closure/${cashRegisterClosureId}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className}>...</Button>
      </PopoverTrigger>
      <PopoverContent align="center" side={"top"} className="p-2  w-auto">
        <div className="grid gap-2 bg-slate-900">
          <Button
            onClick={() =>
              handleRegisterMovement(CashRegisterMovementTypeEnum.INCOME)
            }
          >
            Ingresar dinero
          </Button>
          <Button
            onClick={() =>
              handleRegisterMovement(CashRegisterMovementTypeEnum.EXPENSE)
            }
          >
            Retirar dinero
          </Button>
          <Button onClick={() => handleRegisterClosure()}>Cerrar Caja</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
