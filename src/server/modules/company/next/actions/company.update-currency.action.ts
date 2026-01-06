"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Company } from "@/server/modules/company/domain/company.interface";
import { companyUpdateCurrencyUseCase } from "@/server/modules/company/use-cases/company.update-currency.use-case";

export const companyUpdateCurrencyAction = async (
  company: Company
): Promise<ResponseAction> => {
  if (!company?.id) {
    return {
      success: false,
      message: "Empresa inválida.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await companyUpdateCurrencyUseCase(company);

  if (resp.success && resp.data) {
    revalidatePath("/config/companies/general");
  }

  return resp;
};
