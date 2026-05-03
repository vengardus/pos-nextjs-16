import "server-only";

import prisma from "@/server/db/prisma";
import type { Category } from "@/server/modules/category/domain/category.base.schema";

export const categoryGetAllByCompanyRepository = async (
  companyId: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<{ data: Category[]; total: number }> => {
  const trimmedSearch = search?.trim();
  const filterClause = trimmedSearch
    ? {
        OR: [
          {
            name: {
              contains: trimmedSearch,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const where = {
    companyId,
    ...filterClause,
  };

  if (page !== undefined && limit !== undefined) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.categoryModel.findMany({
        where,
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      }),
      prisma.categoryModel.count({
        where,
      }),
    ]);

    return {
      data: data as Category[],
      total,
    };
  }

  const [data, total] = await Promise.all([
    prisma.categoryModel.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    }),
    prisma.categoryModel.count({
      where,
    }),
  ]);

  return {
    data: data as Category[],
    total,
  };
};
