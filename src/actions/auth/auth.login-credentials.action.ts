"use server";

import { authLoginCredentials } from "@/lib/data/auth/auth.login-credentials";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";


export async function authLoginCredentialsAction(
  formData: FormData
): Promise<ResponseAction> {
  

  return authLoginCredentials(formData);
}
