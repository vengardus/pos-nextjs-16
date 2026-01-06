"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { documentTypeInsertOrUpdateUseCase } from "@/server/modules/document-type/use-cases/document-type.insert-or-update.use-case";

export const documentTypeInsertOrUpdateAction = async (
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

  const resp = await documentTypeInsertOrUpdateUseCase(branch, userId);

  if (resp.success && resp.data) {
    revalidatePath("/config/branchs");
  }

  return resp;
};
