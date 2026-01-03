"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { paymentMethodInsertOrUpdateUseCase } from "@/server/modules/payment-method/use-cases/payment-method.insert-or-update.use-case";

export const paymentMethodInsertOrUpdateAction = async (
  paymentMethod: PaymentMethod
): Promise<ResponseAction> => {
  if (!paymentMethod) {
    return {
      success: false,
      message: "Método de pago inválido.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await paymentMethodInsertOrUpdateUseCase(paymentMethod);

  if (resp.success && resp.data) {
    updateTag(`payment-methods-${resp.data.companyId}`);
    revalidatePath("/config/payment-methods");
  }

  return resp;
};
