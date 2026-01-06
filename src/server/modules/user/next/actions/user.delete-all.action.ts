"use server";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { userDeleteAllUseCase } from "@/server/modules/user/use-cases/user.delete-all.use-case";

export const userDeleteAllAction = async (): Promise<ResponseAction> => {
  return await userDeleteAllUseCase();
};
