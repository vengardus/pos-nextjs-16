import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { PaymentMethodBusiness } from "@/shared/business/payment-method.business";
import {
  cashRegisterClosureCloseCashRegisterRepository,
} from "@/server/modules/cash-register-closure/repository/cash-register-closure.close-cash-register.repository";
import { cashRegisterClosureGetByIdRepository } from "@/server/modules/cash-register-closure/repository/cash-register-closure.get-by-id.repository";

export const cashRegisterClosureCloseCashRegisterUseCase = async (
  registerClosureId: string,
  calculateTotal: number,
  realTotal: number,
  paymentMethods: PaymentMethod[]
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const paymentMethodCash = PaymentMethodBusiness.getPaymentMethodsFromCod(
      paymentMethods,
      PaymentMethodEnum.CASH
    );

    if (!paymentMethodCash) {
      throw new Error("No se encontró el metodo de pago de efectivo");
    }

    const registerClosure = await cashRegisterClosureGetByIdRepository(
      registerClosureId
    );

    if (!registerClosure) {
      throw new Error("No se encontró registro de caja aperturada");
    }

    const difference = Math.round((calculateTotal - realTotal) * 100) / 100;

    const data = await cashRegisterClosureCloseCashRegisterRepository({
      registerClosureId,
      calculateTotal,
      realTotal,
      difference: difference > 0 ? difference : 0,
      cashBalance: difference < 0 ? -difference : 0,
      paymentMethodId: paymentMethodCash.id,
      userId: registerClosure.userId,
    });

    resp.data = data;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
