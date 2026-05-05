import "server-only";

import prisma from "@/server/db/prisma";
import { Prisma } from "@prisma/client";

type BranchUserGetAllByUserResult = Prisma.BranchUserModelGetPayload<{
  select: {
    id: true;
    userId: true;
    branchId: true;
    Branch: {
      select: {
        id: true;
        name: true;
        taxAddress: true;
        isDefault: true;
        companyId: true;
        CashRegister: {
          select: {
            id: true;
            description: true;
            isDefault: true;
          };
        };
      };
    };
  };
}>[];

export const branchUserGetAllByUserRepository = async (
  userId: string,
  page?: number,
  pageSize?: number,
  search?: string
): Promise<{ data: BranchUserGetAllByUserResult; total: number }> => {
  const where = {
    userId,
    ...(search && {
      Branch: {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { taxAddress: { contains: search, mode: "insensitive" as const } },
        ],
      },
    }),
  };

  const queryOptions = {
    where,
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
                isDefault: "desc" as const,
              },
              {
                description: "asc" as const,
              },
            ],
          },
        },
      },
    },
    orderBy: [
      {
        Branch: {
          isDefault: "desc" as const,
        },
      },
      {
        Branch: {
          name: "asc" as const,
        },
      },
    ] as any,
  };

  if (page !== undefined && pageSize !== undefined) {
    const [data, total] = await prisma.$transaction([
      prisma.branchUserModel.findMany({
        ...queryOptions,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.branchUserModel.count({ where }),
    ]);
    return { data: data as BranchUserGetAllByUserResult, total };
  }

  const [data, total] = await prisma.$transaction([
    prisma.branchUserModel.findMany(queryOptions),
    prisma.branchUserModel.count({ where }),
  ]);

  return { data: data as BranchUserGetAllByUserResult, total };
};
