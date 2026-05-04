import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { clientSupplierGetAllByCompanyRepository } from "@/server/modules/client-supplier/repository/client-supplier.get-all-by-company.repository";

export const clientSupplierGetAllByCompanyUseCase = async (
  companyId: string,
  page: number,
  pageSize: number,
  search?: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");

    const { data, total } = await clientSupplierGetAllByCompanyRepository(
      companyId,
      page,
      pageSize,
      search
    );

    resp.data = data;
    resp.pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
    resp.success = true;
    console.log("query=>clientSupplierGetAllByCompany");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
