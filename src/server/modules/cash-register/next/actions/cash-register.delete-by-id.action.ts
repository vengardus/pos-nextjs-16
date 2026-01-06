"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { cashRegisterDeleteByIdUseCase } from "@/server/modules/cash-register/use-cases/cash-register.delete-by-id.use-case";

export const cashRegisterDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  const resp = await cashRegisterDeleteByIdUseCase(id);

  if (resp.success && resp.data) {
    revalidatePath("/config/branches");
  }

  return resp;
};
