import "server-only";

import prisma from "@/server/db/prisma";
import type { Product } from "@/server/modules/product/domain/product.interface";

export const productGetAllByCompanyRepository = async (
  companyId: string,
  page: number,
  pageSize: number,
  search?: string
): Promise<{ data: Product[]; total: number }> => {
  const where = {
    companyId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } as any },
        { internalCode: { contains: search, mode: "insensitive" } as any },
        { barcode: { contains: search, mode: "insensitive" } as any },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.productModel.findMany({
      where: where as any,
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        Category: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.productModel.count({ where: where as any }),
  ]);

  return {
    data: data.map((product) => ({
      ...product,
      categoryName: product.Category?.name ?? "",
    })) as Product[],
    total,
  };
};
