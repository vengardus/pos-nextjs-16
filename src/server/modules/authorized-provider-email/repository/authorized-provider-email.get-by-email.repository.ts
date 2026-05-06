import "server-only";

import prisma from "@/server/db/prisma";

export const authorizedProviderEmailGetByEmailRepository = async (
  email: string
) => {
  return prisma.authorizedProviderEmailModel.findUnique({
    where: { email },
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
  });
};
