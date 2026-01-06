import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { clientSupplierDeleteByIdRepository } from "../repository/client-supplier.delete-by-id.repository";
import { clientSupplierGetByIdRepository } from "../repository/client-supplier.get-by-id.repository";

export const clientSupplierDeleteByIdUseCase = async (
  id: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const clientSupplier = await clientSupplierGetByIdRepository(id);
    if (!clientSupplier) throw new Error("ClientSupplier not found");
    if (clientSupplier.isDefault)
      throw new Error("ClientSupplier genérica no puede ser eliminada.");

    const clientSupplierDelete = await clientSupplierDeleteByIdRepository(id);

    resp.data = clientSupplierDelete;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
