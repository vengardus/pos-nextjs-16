import "server-only";

import prisma from "@/server/db/prisma";

export const authorizedProviderEmailGetAllRepository = async () => {
  return prisma.authorizedProviderEmailModel.findMany({
    select: {
      id: true,
      email: true,
      clientName: true,
      expirationDate: true,
      isActive: true,
      isSuperAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });
};
