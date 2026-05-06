import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { AuthorizedProviderEmailBaseSchema } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";
import { authorizedProviderEmailGetAllRepository } from "@/server/modules/authorized-provider-email/repository/authorized-provider-email.get-all.repository";

export const authorizedProviderEmailGetAllUseCase = async (): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const data = await authorizedProviderEmailGetAllRepository();
    resp.success = true;
    resp.data = data.map((item) => AuthorizedProviderEmailBaseSchema.parse(item));
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
