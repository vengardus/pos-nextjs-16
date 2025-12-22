import "server-only";

import prisma from "@/server/db/prisma";
import type { Company } from "@/types/interfaces/company/company.interface";

type CompanyUpdateInput = Omit<Company, "id">;

export const companyUpdateRepository = async (
  id: string,
  data: CompanyUpdateInput
): Promise<Company> => {
  return await prisma.companyModel.update({
    where: {
      id,
    },
    data,
  });
};
