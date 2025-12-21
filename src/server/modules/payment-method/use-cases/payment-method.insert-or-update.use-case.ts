import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { paymentMethodInsertOrUpdateRepository } from "../repository/payment-method.insert-or-update.repository";

export const paymentMethodInsertOrUpdateUseCase = async (
  paymentMethod: PaymentMethod
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const proccesPaymentMethod =
      await paymentMethodInsertOrUpdateRepository(paymentMethod);

    resp.data = proccesPaymentMethod;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
