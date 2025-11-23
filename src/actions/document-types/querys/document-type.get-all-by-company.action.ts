"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { DocumentType } from "@/types/interfaces/document-type/document-type.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const documentTypeGetAllByCompany = async (
  companyId: string
): Promise<ResponseAction> => {

  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");
    const data = await prisma.documentTypeModel.findMany({
      where: {
        companyId,
      },
    });
    console.log("=>document-types/get-all-by-company");
    resp.data = data as DocumentType[];
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
