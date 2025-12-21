"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { authGetSession } from "@/lib/data/auth/auth.get-session";
import { branchInsertOrUpdateUseCase } from "@/server/modules/branch/use-cases/branch.insert-or-update.use-case";

export const branchInsertOrUpdateAction = async (
  branch: Branch
): Promise<ResponseAction> => {
  if (!branch) {
    return {
      success: false,
      message: "Sucursal inválida.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const respSession = await authGetSession();
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

  const userId = respSession.data.sessionUser.id;
  if (!userId) {
    return {
      success: false,
      message: "No hay sesión de usuario.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await branchInsertOrUpdateUseCase(branch, userId);

  if (resp.success && resp.data) {
    updateTag(`branches-${resp.data.companyId}`);
    updateTag(`branch-user-${userId}`);
    updateTag(`company-user-${userId}`);
    revalidatePath("/config/branchs");
  }

  return resp;
};
