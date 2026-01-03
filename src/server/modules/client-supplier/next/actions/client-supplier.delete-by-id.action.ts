"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { clientSupplierDeleteByIdUseCase } from "@/server/modules/client-supplier/use-cases/client-supplier.delete-by-id.use-case";

export const clientSupplierDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  const resp = await clientSupplierDeleteByIdUseCase(id);

  if (resp.success && resp.data) {
    revalidatePath("/config/clients-suppliers");
  }

  return resp;
};
