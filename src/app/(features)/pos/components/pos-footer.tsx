"use client";

import { CashRegisterMovementTypeEnum } from "@/types/enums/cash-register-movement-type.enum";
import { redirect } from "next/navigation";
import { useCartStore } from "@/stores/cart/cart.store";
import { ButtonIcon } from "@/components/common/buttons/button-icon";
//import { cn } from "@/lib/utils";
//import { useCartProdut } from "@/hooks/pos/use-cart-product";

export const PosFooter = () => {
  const cashRegisterOpen = useCartStore(
    (state) => state.cashRegisterOpen
  );
  //const [isLoading, setIsLoading] = useState(false);
  //const { saveSale } = useCartProdut();

  // const handleSaveSale = async () => {
  //   saveSale(setIsLoading, null);
  // };

  const handleRegisterMovement = (type: CashRegisterMovementTypeEnum) => {
    redirect(`/cash-register/movement/${type}`);
  };
  const handleRegisterClosure = () => {
    redirect(`/cash-register/closure/${cashRegisterOpen?.cashRegisterClosureId}`);
  };

  return (
    <div className="grid grid-cols-4 gap-3 items-center">
      <ButtonIcon label={"Eliminar"} handleClick={() => {}} />
      <ButtonIcon
        label={"Ingresar Dinero"}
        handleClick={() =>
          handleRegisterMovement(CashRegisterMovementTypeEnum.INCOME)
        }
      />
      <ButtonIcon
        label={"Retirar Dinero"}
        handleClick={() =>
          handleRegisterMovement(CashRegisterMovementTypeEnum.EXPENSE)
        }
      />
      <ButtonIcon
        label={"Cerrar Caja"}
        handleClick={() => handleRegisterClosure()}
      />
      {/* <ButtonIcon
        label={!isLoading ? `Cobrar` : `Grabando...`}
        className={cn("", {
          "bg-[#3ff563] text-black font-bold": isLoading,
        })}
        handleClick={handleSaveSale}
      /> */}
      <ButtonIcon label={"Cerrar"} handleClick={() => {}} />
    </div>
  );
};
