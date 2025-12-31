import "server-only";

import prisma from "@/server/db/prisma";

type BranchUserGetAllByUserResult = Awaited<
  ReturnType<typeof prisma.branchUserModel.findMany>
>;

export const branchUserGetAllByUserRepository = async (
  userId: string
): Promise<BranchUserGetAllByUserResult> => {
  return await prisma.branchUserModel.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      branchId: true,
      Branch: {
        select: {
          id: true,
          name: true,
          taxAddress: true,
          isDefault: true,
          companyId: true,
          CashRegister: {
            select: {
              id: true,
              description: true,
              isDefault: true,
            },
            orderBy: [
              {
                isDefault: "desc",
              },
              {
                description: "asc",
              },
            ],
          },
        },
      },
    },
    orderBy: [
      {
        Branch: {
          isDefault: "desc", // Primero los isDefault = true
        },
      },
      {
        Branch: {
          name: "asc", // Luego ordena por name en orden alfabético
        },
      },
    ],
  });
};
