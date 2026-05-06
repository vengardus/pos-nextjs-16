import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import {
  DemoPolicyInputSchema,
  type DemoPolicyInput,
} from "@/server/modules/demo-policy/domain/demo-policy.input.schema";
import { demoPolicyUpsertRepository } from "@/server/modules/demo-policy/repository/demo-policy.upsert.repository";
import { DemoPolicyBaseSchema } from "@/server/modules/demo-policy/domain/demo-policy.base.schema";

export const demoPolicyUpsertUseCase = async (
  payload: DemoPolicyInput
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const validated = DemoPolicyInputSchema.parse(payload);
    const policy = await demoPolicyUpsertRepository(validated);

    resp.success = true;
    resp.data = DemoPolicyBaseSchema.parse(policy);
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
