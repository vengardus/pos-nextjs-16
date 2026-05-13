import "server-only";
import prisma from "@/server/db/prisma";
import { AppConstants } from "@/shared/constants/app.constants";

export async function logsGetAllRepository(page: number, pageSize: number = AppConstants.DEFAULT_PAGE_SIZE) {
  const [data, total] = await prisma.$transaction([
    prisma.logModel.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        User: {
          select: { email: true }
        }
      }
    }),
    prisma.logModel.count(),
  ]);

  return { data, total };
}
