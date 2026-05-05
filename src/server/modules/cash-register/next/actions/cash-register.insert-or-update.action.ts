"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { CashRegister } from "@/server/modules/cash-register/domain/cash-register.types";
import { cashRegisterInsertOrUpdateUseCase } from "@/server/modules/cash-register/use-cases/cash-register.insert-or-update.use-case";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { branchUserCacheTag } from "../../branch-user/next/cache/branch-user.tags";

interface CashRegisterInsertOrUpdateData {
  cashRegister: CashRegister;
  companyId: string;
}

export const cashRegisterInsertOrUpdateAction = async (
  cashRegister: CashRegister
): Promise<ResponseAction> => {
  if (!cashRegister) {
    return {
      success: false,
      message: "Caja inválida.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await cashRegisterInsertOrUpdateUseCase(cashRegister);

  if (resp.success && resp.data) {
    const { cashRegister: processedCashRegister, companyId } =
      resp.data as CashRegisterInsertOrUpdateData;

    const respSession = await authGetSessionUseCase();
    if (respSession.data.isAuthenticated) {
      const userId = respSession.data.sessionUser.id;
      if (userId) {
        updateTag(branchUserCacheTag(userId));
      }
    }

    updateTag("branches");
    updateTag("branch-user");
    updateTag(`cash-register-${companyId}`);
    console.log("=>REVALIDATE", `cash-register-${companyId}`);
    revalidatePath("/config/branches");

    resp.data = processedCashRegister;
  }

  return resp;
};
