import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { AppConstants } from "@/shared/constants/app.constants";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { clientSupplierInsertOrUpdateRepository } from "../repository/client-supplier.insert-or-update.repository";

export const clientSupplierInsertOrUpdateUseCase = async (
  clientSupplier: ClientSupplier
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const payload = clientSupplier.id
      ? clientSupplier
      : {
          ...clientSupplier,
          status: AppConstants.DEFAULT_VALUES.states.active,
        };

    const proccesClientSupplier =
      await clientSupplierInsertOrUpdateRepository(payload);

    resp.data = proccesClientSupplier;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
