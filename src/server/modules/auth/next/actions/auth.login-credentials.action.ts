"use server";

import { authLoginCredentialsUseCase } from "@/server/modules/auth/use-cases/auth.login-credentials.use-case";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";


export async function authLoginCredentialsAction(
  formData: FormData
): Promise<ResponseAction> {
  return await authLoginCredentialsUseCase(formData);
}
