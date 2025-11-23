"use server";

import { auth } from "@/auth";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";

export const authGetSession = async (): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const session = await auth();
  resp.success = true
  resp.data = {
    session,
    isAuthenticated: !!session,
    sessionUser: session?.user,
  }
  return resp;
};
