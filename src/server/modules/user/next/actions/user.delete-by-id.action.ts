"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { userDeleteByIdUseCase } from "@/server/modules/user/use-cases/user.delete-by-id.use-case";
import { getAuthCached } from "@/server/modules/auth/next/cache/auth.get-session.cache";

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

  const sessionResponse = await getAuthCached();
  if (!sessionResponse.data.isAuthenticated) {
    return {
      success: false,
      message: "No autorizado.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const requesterId = sessionResponse.data.sessionUser.id;
  const requesterRole = sessionResponse.data.sessionUser.role;

  const resp = await userDeleteByIdUseCase(id, requesterId, requesterRole);

  if (resp.success && resp.data) {
    revalidatePath("/config/users");
  }

  return resp;
};
