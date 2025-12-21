"use server";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { SuperadminParams } from "@/server/modules/user/use-cases/user.insert-superadmin.use-case";
import { userInsertSuperadminUseCase } from "@/server/modules/user/use-cases/user.insert-superadmin.use-case";

export const userInsertSuperadminAction = async (
  params: SuperadminParams
): Promise<ResponseAction> => {
  if (!params) {
    return {
      success: false,
      message: "Parámetros inválidos.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  return await userInsertSuperadminUseCase(params);
};
