import "server-only";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signOut } from "@/auth";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";

export const authLogoutUseCase = async (): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    resp.success = true;
    await signOut();
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    resp.message = (error as Error).message;
  }
  console.log({ resp });
  return resp;
};
