import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { ExecContext } from "./exec-context.type";
import { ModuleEnum } from "@/types/enums/module.enum";

import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { userGetByColumnCached } from "@/server/modules/user/next/cache/user.cache";
import { companyGetByUserCached } from "@/server/modules/company/next/cache/company.get-by-user.cache";
import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";

export async function resolveExecContext(params: {
  authCode: string | null;
  module: ModuleEnum;
}): Promise<ResponseAction> {
  let resp = initResponseAction();

  // Caso 1: viene de la app (sin authCode → sesión normal)
  if (params.authCode === null) 
    resp = await resolveCaseSession(params.module);
  else {
    // Caso 2: viene con authCode (endpoint externo)
    resp = await resolveCaseAuthCode(params.authCode);
  }

  return resp;
}


// Helpers

const resolveCaseSession = async (
  module: ModuleEnum
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const authResult = await checkAuthenticationAndPermission(module);

    if (
      !authResult.isAuthenticated ||
      !authResult.company ||
      !authResult.userId
    ) 
      throw new Error(
        authResult.errorMessage ?? "No se pudo autenticar la sesión."
      );

    resp.success = true;
    resp.data = {
      companyId: authResult.company.id,
      userId: authResult.userId,
      authSource: "session",
    } as ExecContext;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
}

const resolveCaseAuthCode = async (
  authCode: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const userResult = await userGetByColumnCached("phone", authCode);
    if (!userResult.success || !userResult.data)
      throw new Error(userResult.message ?? "Usuario no encontrado.");

    const userId = userResult.data.id as string;
    const companyResult = await companyGetByUserCached(userId, "");
    if (!companyResult.success || !companyResult.data)
      throw new Error(companyResult.message ?? "Compañía no encontrada.");

    const companyId = companyResult.data.id as string;

    resp.success = true;
    resp.data = {
        companyId,
        userId,
        authSource: "authCode",
      } as ExecContext;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
}
