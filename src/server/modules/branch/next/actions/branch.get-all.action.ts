"use server";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { branchGetAllUseCase } from "../../use-cases/branch.get-all.use-case";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";

export const branchGetAllAction = async (
  companyId: string
): Promise<ResponseAction> => {
  const respSession = await authGetSessionUseCase();
  if (!respSession.data.isAuthenticated) {
    return {
      success: false,
      message: "Usuario no autenticado.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  return await branchGetAllUseCase(companyId);
};
