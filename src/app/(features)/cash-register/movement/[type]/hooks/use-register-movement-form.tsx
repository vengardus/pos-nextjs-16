import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { CashRegisterMovement } from "@/types/interfaces/cash-register-movement/cash-register-movement.interface";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { CashRegisterMovementTypeEnum } from "@/types/enums/cash-register-movement-type.enum";
import {
  RegisterMovementFormSchema,
  RegisterMovementFormSchemaType,
} from "@/app/(features)/cash-register/movement/[type]/schemas/register-movement-form.schema";
import { usePaymentMethodStore } from "@/stores/payment-method/payment-method.store";
import { useCartStore } from "@/stores/cart/cart.store";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { initResponseAction } from "@/utils/response/init-response-action";
import { cashRegisterMovementInsert } from "@/actions/cash-register-movement/mutations/cash-register-movement.insert.action";

const defaultValues: RegisterMovementFormSchemaType = {
  motive: "",
  amount: 0.0,
  paymentMethod: PaymentMethodEnum.CASH,
};

export const useRegisterMovementForm = (movementType: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const getPaymentMethodFromCod = usePaymentMethodStore(
    (state) => state.getPaymentMethodFromCod
  );
  const cashRegisterOpen = useCartStore(
    (state) => state.cashRegisterOpen
  );

  const form = useForm<RegisterMovementFormSchemaType>({
    resolver: zodResolver(RegisterMovementFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    setIsLoading(false);
  }, [form]);

  const handleRegisterMovementSave = async (
    values: RegisterMovementFormSchemaType
  ) => {
    values.motive = toCapitalize(values.motive ?? "");
    const resp = initResponseAction();

    // pre-validate
    const paymentMethodSelect = getPaymentMethodFromCod(values.paymentMethod);

    //
    setIsPending(true);

    const movementDescription =
      movementType == CashRegisterMovementTypeEnum.INCOME
        ? "Ingreso de dinero con"
        : "Retiro de dinero con";

    const cashRegisterMovement: CashRegisterMovement = {
      description: `${movementDescription} ${paymentMethodSelect?.cod} ${
        values.motive?.length ? " - " + values.motive : ""
      }`,
      amount: values.amount,
      paymentMethodId: paymentMethodSelect ? paymentMethodSelect.id : "",
      changeDue: 0.0,
      movementCategory: CashRegisterMovementCategoryEnum.MOVEMENT_TYPE,
      paymentMethodCod: values.paymentMethod,
      movementType: movementType,
      userId: "",
      cashRegisterClosureId: cashRegisterOpen.cashRegisterClosureId,
    };
    console.log("cashRegisterMovement", cashRegisterMovement);

    const respInsert = await cashRegisterMovementInsert(
      cashRegisterMovement
    );

    if (respInsert.success) {
      toast.success(`Movimiento grabado exitósamente.`);
    } else {
      toast.error(`Error: No se pudo grabar movimiento`, {
        description: resp.message,
      });
    }

    setIsPending(false);
    return respInsert;
  };

  return {
    form,
    handleRegisterMovementSave,
    isPending,
    isLoading,
    messageGeneralError,
    setMessageGeneralError,
  };
};
