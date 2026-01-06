"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { CashRegisterClosure } from "@/server/modules/cash-register-closure/domain/cash-register-closure.types";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import { cashRegisterClosureInsertUseCase } from "@/server/modules/cash-register-closure/use-cases/cash-register-closure.insert.use-case";

export const cashRegisterClosureInsertAction = async (
  registerClosure: CashRegisterClosure,
  paymentMethods: PaymentMethod[]
): Promise<ResponseAction> => {
  if (!registerClosure || !paymentMethods?.length) {
    return {
      success: false,
      message: "Datos de cierre de caja inválidos.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const { id: _id, ...rest } = registerClosure;
  console.log("rest", rest, registerClosure);

  const resp = await cashRegisterClosureInsertUseCase(
    registerClosure,
    paymentMethods
  );

  if (resp.success && resp.data) {
    const data = resp.data as CashRegisterClosure;

    console.log(
      "registerClosure.insert",
      `cash-register-closure-${data.cashRegisterId}`
    );
    console.log("registerClosure.insert", `cash-register-closure-${data.id}`);
    console.log(
      "registerClosure.insert",
      `cash-register-determine-active-${data.userId}`
    );

    updateTag("cash-register-movements");
    updateTag(`cash-register-movements-totals-${data.id}`);
    updateTag(`cash-register-closure-${data.cashRegisterId}`);
    updateTag(`cash-register-closure-${data.id}`);
    updateTag(`cash-register-determine-active-${data.userId}`);
    revalidatePath("/pos");
  }

  if (!resp.success) {
    console.log("ERROR INSERT CLOSURE:", resp.message);
  }

  return resp;
};
