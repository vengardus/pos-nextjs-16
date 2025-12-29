"use server";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { authLoginProviderUseCase } from "@/server/modules/auth/use-cases/auth.login-provider.use-case";

export const authLoginProviderAction = async (
  formData: FormData
): Promise<ResponseAction> => {
  
  return await authLoginProviderUseCase(formData);
};
