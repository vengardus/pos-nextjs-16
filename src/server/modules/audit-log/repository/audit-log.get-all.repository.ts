import prisma from "@/server/db/prisma";

export const auditLogGetAllRepository = async (page: number, pageSize: number) => {
  const [data, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.auditLog.count(),
  ]);
  return { data, total };
};
