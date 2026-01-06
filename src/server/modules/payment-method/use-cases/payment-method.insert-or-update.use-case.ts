import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
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
