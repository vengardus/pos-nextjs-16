"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Company } from "@/types/interfaces/company/company.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

// Configuration Cloudinary

export const companyUpdateCurrency = async (
  company: Company,
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, iso, currencySymbol, country, currency } = company;

  try {
    const companyUpated = await prisma.companyModel.update({
      where: {
        id,
      },
      data: {
        currency,
        currencySymbol,
        country,
        iso
      },
    })
    resp.data = companyUpated;
    resp.success = true;

    revalidatePath("/config/companies/general");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};