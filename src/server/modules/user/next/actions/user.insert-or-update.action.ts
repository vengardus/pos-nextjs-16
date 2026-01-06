"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import { userInsertOrUpdateUseCase } from "@/server/modules/user/use-cases/user.insert-or-update.use-case";

export const userInsertOrUpdateAction = async (
  user: UserWithRelations,
  companyId: string
): Promise<ResponseAction> => {
  if (!user) {
    return {
      success: false,
      message: "Usuario inválido.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await userInsertOrUpdateUseCase(user);

  if (resp.success && resp.data) {
    console.log("Revalidate users", `users-${companyId}`);
    updateTag(`users-${companyId}`);
    revalidatePath("/config/users");
  }

  return resp;
};
