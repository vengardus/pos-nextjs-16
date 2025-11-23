"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const categoryGetAllByCompany = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");
    const data = await prisma.categoryModel.findMany({
      where: {
        companyId,
      },
    });
    resp.data = data as Category[];
    resp.success = true;
    console.log("=>categories/get-all-by-company");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
