import "server-only";

import prisma from "@/server/db/prisma";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";

export const userGetAllWithRelationsRepository = async (): Promise<
  UserWithRelations[]
> => {
  return await prisma.userModel.findMany({
    include: {
      Company: true,
      Sale: {
        include: {
          SaleDetail: {
            include: {
              Product: true,
            },
          },
          CashRegisterMovement: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
