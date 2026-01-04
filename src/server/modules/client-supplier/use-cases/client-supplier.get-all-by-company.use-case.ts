import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { clientSupplierGetAllByCompanyRepository } from "@/server/modules/client-supplier/repository/client-supplier.get-all-by-company.repository";

export const clientSupplierGetAllByCompanyUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");

    const data = await clientSupplierGetAllByCompanyRepository(companyId);

    resp.data = data as ClientSupplier[];
    resp.success = true;
    console.log("query=>clientSupplierGetAllByCompany");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
