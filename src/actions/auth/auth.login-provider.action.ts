"use server";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { authLoginProvider } from "@/lib/data/auth/auth.login-provider";

export const authLoginProviderAction = async (
  formData: FormData
): Promise<ResponseAction> => {
  
  return await authLoginProvider(formData);
};
