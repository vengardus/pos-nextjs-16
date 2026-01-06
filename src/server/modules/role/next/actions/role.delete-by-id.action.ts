"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { roleDeleteByIdUseCase } from "@/server/modules/role/use-cases/role.delete-by-id.use-case";

export const roleDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  const resp = await roleDeleteByIdUseCase(id);

  if (resp.success && resp.data) {
    updateTag(`roles-${resp.data.companyId}`);
    revalidatePath("/config/roles");
  }

  return resp;
};
