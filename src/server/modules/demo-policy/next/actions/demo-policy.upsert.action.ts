"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import {
  DemoPolicyInputSchema,
  type DemoPolicyInput,
} from "@/server/modules/demo-policy/domain/demo-policy.input.schema";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { demoPolicyUpsertUseCase } from "@/server/modules/demo-policy/use-cases/demo-policy.upsert.use-case";

export const demoPolicyUpsertAction = async (
  payload: DemoPolicyInput
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

  const validation = DemoPolicyInputSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message ?? "Datos de política demo inválidos.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await demoPolicyUpsertUseCase(validation.data);

  if (resp.success) {
    revalidatePath("/super-admin/config/demo-policy");
  }

  return resp;
};
