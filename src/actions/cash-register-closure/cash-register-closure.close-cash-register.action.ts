"use server";

import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { CashRegisterStatusEnum } from "@/types/enums/cash-register-status.enum";
import { revalidatePath, updateTag } from "next/cache";
import { PaymentMethodBusiness } from "@/shared/business/payment-method.business";

export const cashRegisterClosureCloseCashRegister = async (
  registerClosureId: string,
  calculateTotal: number,
  realTotal: number, 
  paymentMethods: PaymentMethod[]
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    const paymentMethodCash = PaymentMethodBusiness.getPaymentMethodsFromCod(paymentMethods, PaymentMethodEnum.CASH)
    if (!paymentMethodCash) {
      throw new Error("No se encontró el metodo de pago de efectivo");
    }

    const registerClosure = await prisma.cashRegisterClosureModel.findUnique({
      where: {
        id: registerClosureId,
      },
      select: {
        id: true,
        userId: true
      }
    });
    if (!registerClosure) {
      throw new Error("No se encontró registro de caja aperturada");
    }

    const difference = Math.round((calculateTotal - realTotal)*100)/100

    const data = await prisma.cashRegisterClosureModel.update({
      where: {
        id: registerClosureId
      },
      data: {
        endDate: new Date(),
        calculateTotal: calculateTotal,
        realTotal: realTotal,
        difference: difference > 0 ? difference : 0,
        cashBalance: difference < 0 ? -difference : 0,
        status: CashRegisterStatusEnum.CLOSING,
        CashRegisterMovement: {
          create: [
            {
              //cashRegisterId: registerClosure.cashRegisterId,
              amount: realTotal,
              description: `Cierre de caja con ${PaymentMethodEnum.CASH}`,
              movementCategory: CashRegisterMovementCategoryEnum.CASH_REGISTER_STATUS,
              movementType: CashRegisterStatusEnum.CLOSING,
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

    console.log("Revalidate cash-register-closure-close", `cash-register-determine-active-${registerClosure.userId}`);
    // revalidates
    revalidatePath('/pos')
    updateTag("cash-register-movements");
    updateTag(`cash-register-closure-${data.cashRegisterId}`);
    updateTag(`cash-register-closure-${data.id}`);
    updateTag(`cash-register-determine-active-${registerClosure.userId}`);

  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
