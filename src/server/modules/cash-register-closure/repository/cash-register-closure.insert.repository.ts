import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegisterClosure } from "@/types/interfaces/cash-register-closure/cash-register-closure.interface";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { CashRegisterStatusEnum } from "@/types/enums/cash-register-status.enum";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";

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
