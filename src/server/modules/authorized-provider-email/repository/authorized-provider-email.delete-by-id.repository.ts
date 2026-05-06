import "server-only";

import prisma from "@/server/db/prisma";

export const authorizedProviderEmailDeleteByIdRepository = async (
  id: string
) => {
  return prisma.authorizedProviderEmailModel.delete({
    where: { id },
  });
};
