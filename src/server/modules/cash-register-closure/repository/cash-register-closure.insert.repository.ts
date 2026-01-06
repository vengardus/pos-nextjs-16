import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegisterClosure } from "../domain/cash-register-closure.types";
import { CashRegisterMovementCategoryEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-category.enum";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";

interface CashRegisterClosureInsertRepositoryParams {
  registerClosure: CashRegisterClosure;
  paymentMethodId: string;
}

export const cashRegisterClosureInsertRepository = async ({
  registerClosure,
  paymentMethodId,
}: CashRegisterClosureInsertRepositoryParams): Promise<CashRegisterClosure> => {
  const { id, ...rest } = registerClosure;

  return await prisma.cashRegisterClosureModel.create({
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
            paymentMethodId,
            userId: registerClosure.userId,
            saleId: null,
          },
        ],
      },
    },
  });
};
