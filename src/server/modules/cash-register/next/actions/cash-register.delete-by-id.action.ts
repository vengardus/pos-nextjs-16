"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { cashRegisterDeleteByIdUseCase } from "@/server/modules/cash-register/use-cases/cash-register.delete-by-id.use-case";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { branchUserCacheTag } from "../../branch-user/next/cache/branch-user.tags";

export const cashRegisterDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  const resp = await cashRegisterDeleteByIdUseCase(id);

  if (resp.success) {
    const respSession = await authGetSessionUseCase();
    if (respSession.data.isAuthenticated) {
      const userId = respSession.data.sessionUser.id;
      if (userId) {
        updateTag(branchUserCacheTag(userId));
      }
    }
    revalidatePath("/config/branches");
  }

  return resp;
};
