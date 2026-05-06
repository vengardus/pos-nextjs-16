import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { DemoPolicyBaseSchema } from "@/server/modules/demo-policy/domain/demo-policy.base.schema";
import { demoPolicyGetByCompanyIdRepository } from "@/server/modules/demo-policy/repository/demo-policy.get-by-company-id.repository";

export const demoPolicyGetByCompanyIdUseCase = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) {
      throw new Error("El companyId es obligatorio.");
    }

    const record = await demoPolicyGetByCompanyIdRepository(companyId);
    resp.success = true;
    resp.data = record ? DemoPolicyBaseSchema.parse(record) : null;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
