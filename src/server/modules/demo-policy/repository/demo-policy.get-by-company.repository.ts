import "server-only";
import { prisma } from "@/server/db/prisma";

export const demoPolicyGetByCompanyRepository = async (companyId: string) => {
  return await prisma.demoPolicyModel.findUnique({
    where: { companyId },
  });
};
