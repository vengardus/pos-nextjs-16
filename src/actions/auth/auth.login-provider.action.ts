"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/auth";
import type { ProviderOAuth } from "@/types/interfaces/auth/provider-oauth.type";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { AppConstants } from "@/constants/app.constants";
import { initResponseAction } from "@/utils/response/init-response-action";

export const authLoginProvider = async (
  formData: FormData
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  const provider = formData.get("provider") as ProviderOAuth;

  try {
    await signIn(provider, {
      redirectTo: AppConstants.URL_HOME,
    });
    resp.success = true;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    resp.message = (error as Error).message;
  }
  return resp;
};
