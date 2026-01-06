"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Company } from "@/server/modules/company/domain/company.interface";
import { companyUpdateUseCase } from "@/server/modules/company/use-cases/company.update.use-case";

export const companyUpdateAction = async (
  company: Company,
  fileList: FileList | []
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

  const resp = await companyUpdateUseCase(company, fileList);

  if (resp.success && resp.data) {
    updateTag(`company-${resp.data.userId}`);
    revalidatePath("/config/companies/general");
  }

  return resp;
};
