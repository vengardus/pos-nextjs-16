"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";
import { cashRegisterInsertOrUpdateUseCase } from "@/server/modules/cash-register/use-cases/cash-register.insert-or-update.use-case";

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

    updateTag("branches");
    updateTag("branch-user");
    updateTag(`cash-register-${companyId}`);
    console.log("=>REVALIDATE", `cash-register-${companyId}`);
    revalidatePath("/config/branches");

    resp.data = processedCashRegister;
  }

  return resp;
};
