"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { paymentMethodDeleteByIdUseCase } from "@/server/modules/payment-method/use-cases/payment-method.delete-by-id.use-case";
import { updateTag } from "next/cache";

export const paymentMethodDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  const resp = await paymentMethodDeleteByIdUseCase(id);

  if (resp.success && resp.data) {
    updateTag(`payment-methods-${resp.data.companyId}`);
    revalidatePath("/config/payment-methods");
  }

  return resp;
};
