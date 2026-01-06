import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { CashRegisterClosure } from "@/server/modules/cash-register-closure/domain/cash-register-closure.types";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";
import { cashRegisterClosureInsertRepository } from "@/server/modules/cash-register-closure/repository/cash-register-closure.insert.repository";

export const cashRegisterClosureInsertUseCase = async (
  registerClosure: CashRegisterClosure,
  paymentMethods: PaymentMethod[]
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const paymentMethodCash = paymentMethods.find(
      (paymentMethod) => paymentMethod.cod === PaymentMethodEnum.CASH
    );

    if (!paymentMethodCash) {
      throw new Error("No se encontró el metodo de pago de efectivo");
    }

    const data = await cashRegisterClosureInsertRepository({
      registerClosure,
      paymentMethodId: paymentMethodCash.id,
    });

    resp.data = data;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
