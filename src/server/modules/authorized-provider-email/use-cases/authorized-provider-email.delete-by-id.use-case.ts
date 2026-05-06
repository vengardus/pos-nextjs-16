import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { authorizedProviderEmailDeleteByIdRepository } from "@/server/modules/authorized-provider-email/repository/authorized-provider-email.delete-by-id.repository";

export const authorizedProviderEmailDeleteByIdUseCase = async (
  id: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!id) {
      throw new Error("El id es obligatorio.");
    }

    await authorizedProviderEmailDeleteByIdRepository(id);
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
