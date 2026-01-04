import "server-only";

import prisma from "@/server/db/prisma";

interface CashRegisterMovementGetTotalsRepositoryProps {
  cashRegisterClosureId: string;
  typeQuery: "by-cash-register-closure-id" | "by-date-range";
  startDateUTC?: Date;
  endDateUTC?: Date;
  companyId?: string;
}

export const cashRegisterMovementGetTotalsRepository = async ({
  cashRegisterClosureId,
  typeQuery,
  startDateUTC,
  endDateUTC,
  companyId,
}: CashRegisterMovementGetTotalsRepositoryProps) => {
  if (typeQuery === "by-cash-register-closure-id") {
    if (!cashRegisterClosureId) {
      throw new Error("cashRegisterClosureId is required");
    }

    return prisma.cashRegisterMovementModel.findMany({
      where: {
        cashRegisterClosureId,
      },
      select: {
        amount: true,
        movementCategory: true,
        paymentMethodCod: true,
        movementType: true,
        changeDue: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  if (!startDateUTC || !endDateUTC) {
    throw new Error("startDateUTC and endDateUTC are required");
  }

  console.log("Filtrado por fechas:", startDateUTC, endDateUTC);
  return prisma.cashRegisterMovementModel.findMany({
    where: {
      date: {
        gte: startDateUTC,
        lte: endDateUTC,
      },
      PaymentMethod: {
        Company: {
          id: companyId,
        },
      },
    },
    select: {
      amount: true,
      movementCategory: true,
      paymentMethodCod: true,
      movementType: true,
      changeDue: true,
      date: true,
      User: {
        select: {
          id: true,
          Company: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};
