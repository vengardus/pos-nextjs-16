"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { userDeleteByIdUseCase } from "@/server/modules/user/use-cases/user.delete-by-id.use-case";

export const userDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  if (!id) {
    return {
      success: false,
      message: "Id inválido.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await userDeleteByIdUseCase(id);

  if (resp.success && resp.data) {
    revalidatePath("/config/users");
  }

  return resp;
};
