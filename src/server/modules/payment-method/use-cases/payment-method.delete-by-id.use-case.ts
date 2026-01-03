import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { paymentMethodDeleteByIdRepository } from "../repository/payment-method.delete-by-id.repository";
import { paymentMethodGetByIdRepository } from "../repository/payment-method.get-by-id.repository";

export const paymentMethodDeleteByIdUseCase = async (
  id: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const paymentMethod = await paymentMethodGetByIdRepository(id);
    if (!paymentMethod) throw new Error("PaymentMethod not found");
    if (paymentMethod.isDefault)
      throw new Error("Método de pago genérico no puede ser eliminada.");

    const paymentDelete = await paymentMethodDeleteByIdRepository(id);

    resp.data = paymentDelete;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
