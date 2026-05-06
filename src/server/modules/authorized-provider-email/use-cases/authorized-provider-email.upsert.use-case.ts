import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import {
  AuthorizedProviderEmailInputSchema,
  type AuthorizedProviderEmailInput,
} from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.input.schema";
import { AuthorizedProviderEmailBaseSchema } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";
import { authorizedProviderEmailUpsertRepository } from "@/server/modules/authorized-provider-email/repository/authorized-provider-email.upsert.repository";

export const authorizedProviderEmailUpsertUseCase = async (
  payload: AuthorizedProviderEmailInput
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const validated = AuthorizedProviderEmailInputSchema.parse(payload);
    const data = await authorizedProviderEmailUpsertRepository(validated);
    resp.success = true;
    resp.data = AuthorizedProviderEmailBaseSchema.parse(data);
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
