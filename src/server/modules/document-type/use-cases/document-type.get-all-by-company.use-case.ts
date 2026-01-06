import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { DocumentType } from "@/server/modules/document-type/domain/document-type.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { documentTypeGetAllByCompanyRepository } from "@/server/modules/document-type/repository/document-type.get-all-by-company.repository";

export const documentTypeGetAllByCompanyUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");

    const data = await documentTypeGetAllByCompanyRepository(companyId);
    console.log("query=>documentTypeGetAllByCompany");

    resp.data = data as DocumentType[];
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
