import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { paymentMethodGetAllByCompanyRepository } from "../repository/payment-method.get-all-by-company.repository";

export const paymentMethodGetAllByCompanyUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");

    const data = await paymentMethodGetAllByCompanyRepository(companyId);

    resp.data = data as PaymentMethod[];
    resp.success = true;
    console.log("query=>paymentMethodGetAllByCompany");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
