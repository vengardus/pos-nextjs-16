"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import {
  AuthorizedProviderEmailInputSchema,
  type AuthorizedProviderEmailInput,
} from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.input.schema";
import { authorizedProviderEmailUpsertUseCase } from "@/server/modules/authorized-provider-email/use-cases/authorized-provider-email.upsert.use-case";

export const authorizedProviderEmailUpsertAction = async (
  payload: AuthorizedProviderEmailInput
): Promise<ResponseAction> => {
  const sessionResp = await authGetSessionUseCase();

  if (!sessionResp.data?.isAuthenticated) {
    return {
      success: false,
      message: "Usuario no autenticado.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  if (sessionResp.data.sessionUser?.role !== UserRole.SUPER_ADMIN) {
    return {
      success: false,
      message: "No autorizado.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const validation = AuthorizedProviderEmailInputSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message ?? "Datos de whitelist inválidos.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await authorizedProviderEmailUpsertUseCase(validation.data);
  if (resp.success) {
    revalidatePath("/super-admin/config/demo-policy");
  }

  return resp;
};
