import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
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
