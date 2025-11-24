"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CashRegisterClosure } from "@/types/interfaces/cash-register-closure/cash-register-closure.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { CashRegisterStatusEnum } from "@/types/enums/cash-register-status.enum";
import { revalidatePath, updateTag } from "next/cache";

export const cashRegisterClosureInsert = async (
  registerClosure: CashRegisterClosure,
  paymentMethods: PaymentMethod[]
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = registerClosure;
  console.log("rest", rest, registerClosure);
  try {
    const paymentMethodCash = paymentMethods.find(
      (paymentMethod) => paymentMethod.cod === PaymentMethodEnum.CASH
    )
    if (!paymentMethodCash) {
      throw new Error("No se encontró el metodo de pago de efectivo");
    }
    const data = await prisma.cashRegisterClosureModel.create({
      data: {
        ...rest,
        CashRegisterMovement: {
          create: [
            {
              //cashRegisterId: registerClosure.cashRegisterId,
              amount: registerClosure.initialCash,
              description: `Apertura de caja con ${PaymentMethodEnum.CASH}`,
              movementCategory: CashRegisterMovementCategoryEnum.CASH_REGISTER_STATUS,
              movementType: CashRegisterStatusEnum.OPENING,
              paymentMethodCod: PaymentMethodEnum.CASH,
              changeDue: 0,
              paymentMethodId: paymentMethodCash.id,
              userId: registerClosure.userId,
              saleId: null
            }
          ]
        }
      }
    });
    resp.data = data;
    resp.success = true;

    console.log("registerClosure.insert", `cash-register-closure-${data.cashRegisterId}`);
    console.log("registerClosure.insert", `cash-register-closure-${data.id}`);
    console.log("registerClosure.insert", `cash-register-determine-active-${registerClosure.userId}`);

    // revalidates
    revalidatePath('/pos')
    updateTag("cash-register-movements");
    updateTag(`cash-register-closure-${data.cashRegisterId}`);
    updateTag(`cash-register-closure-${data.id}`);
    updateTag(`cash-register-determine-active-${registerClosure.userId}`);
  } catch (error) {
    resp.message = getActionError(error);
    console.log("ERROR INSERT CLOSURE:", error);
  }
  return resp;
};
