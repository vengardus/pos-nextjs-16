"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { CashRegisterClosure } from "@/server/modules/cash-register-closure/domain/cash-register-closure.types";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import { cashRegisterClosureCloseCashRegisterUseCase } from "@/server/modules/cash-register-closure/use-cases/cash-register-closure.close-cash-register.use-case";

export const cashRegisterClosureCloseCashRegisterAction = async (
  registerClosureId: string,
  calculateTotal: number,
  realTotal: number,
  paymentMethods: PaymentMethod[]
): Promise<ResponseAction> => {
  if (!registerClosureId || !paymentMethods?.length) {
    return {
      success: false,
      message: "Datos de cierre de caja inválidos.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await cashRegisterClosureCloseCashRegisterUseCase(
    registerClosureId,
    calculateTotal,
    realTotal,
    paymentMethods
  );

  if (resp.success && resp.data) {
    const data = resp.data as CashRegisterClosure;

    console.log(
      "Revalidate cash-register-closure-close",
      `cash-register-determine-active-${data.userId}`
    );

    updateTag("cash-register-movements");
    updateTag(`cash-register-movements-totals-${data.id}`);
    updateTag(`cash-register-closure-${data.cashRegisterId}`);
    updateTag(`cash-register-closure-${data.id}`);
    updateTag(`cash-register-determine-active-${data.userId}`);
    revalidatePath("/pos");
  }

  return resp;
};
