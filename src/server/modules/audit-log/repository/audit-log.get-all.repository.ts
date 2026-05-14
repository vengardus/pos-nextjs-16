import prisma from "@/server/db/prisma";

export const auditLogGetAllRepository = async () => {
  return await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
  });
};
