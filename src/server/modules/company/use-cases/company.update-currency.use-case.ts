import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Company } from "@/server/modules/company/domain/company.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { companyUpdateCurrencyRepository } from "../repository/company.update-currency.repository";

export const companyUpdateCurrencyUseCase = async (
  company: Company
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, iso, currencySymbol, country, currency } = company;

  try {
    const companyUpated = await companyUpdateCurrencyRepository(id, {
      currency,
      currencySymbol,
      country,
      iso,
    });
    resp.data = companyUpated;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
