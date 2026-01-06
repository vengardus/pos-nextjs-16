import "server-only";

import prisma from "@/server/db/prisma";
import type { Company } from "@/server/modules/company/domain/company.interface";

type CompanyUpdateCurrencyInput = Pick<
  Company,
  "currency" | "currencySymbol" | "country" | "iso"
>;

export const companyUpdateCurrencyRepository = async (
  id: string,
  data: CompanyUpdateCurrencyInput
): Promise<Company> => {
  return await prisma.companyModel.update({
    where: {
      id,
    },
    data,
  });
};
