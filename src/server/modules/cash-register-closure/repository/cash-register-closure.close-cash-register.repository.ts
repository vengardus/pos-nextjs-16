import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegisterClosure } from "@/types/interfaces/cash-register-closure/cash-register-closure.interface";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";

export const cashRegisterClosureGetByIdRepository = async (
  registerClosureId: string
): Promise<Pick<CashRegisterClosure, "id" | "userId"> | null> => {
  return await prisma.cashRegisterClosureModel.findUnique({
    where: {
      id: registerClosureId,
    },
    select: {
      id: true,
      userId: true,
    },
  });
};

interface CashRegisterClosureCloseCashRegisterRepositoryParams {
  registerClosureId: string;
  calculateTotal: number;
  realTotal: number;
  difference: number;
  cashBalance: number;
  paymentMethodId: string;
  userId: string;
}

export const cashRegisterClosureCloseCashRegisterRepository = async ({
  registerClosureId,
  calculateTotal,
  realTotal,
  difference,
  cashBalance,
  paymentMethodId,
  userId,
}: CashRegisterClosureCloseCashRegisterRepositoryParams): Promise<CashRegisterClosure> => {
  return await prisma.cashRegisterClosureModel.update({
    where: {
      id: registerClosureId,
    },
    data: {
      endDate: new Date(),
      calculateTotal,
      realTotal,
      difference,
      cashBalance,
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
            paymentMethodId,
            userId,
            saleId: null,
          },
        ],
      },
    },
  });
};
