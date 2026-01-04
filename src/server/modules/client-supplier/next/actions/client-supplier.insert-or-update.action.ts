"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { clientSupplierInsertOrUpdateUseCase } from "@/server/modules/client-supplier/use-cases/client-supplier.insert-or-update.use-case";

export const clientSupplierInsertOrUpdateAction = async (
  clientSupplier: ClientSupplier
): Promise<ResponseAction> => {
  if (!clientSupplier) {
    return {
      success: false,
      message: "Cliente/proveedor inválido.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await clientSupplierInsertOrUpdateUseCase(clientSupplier);

  if (resp.success && resp.data) {
    updateTag(`clients-suppliers-${resp.data.companyId}`);
    revalidatePath("/config/clients-suppliers");
  }

  return resp;
};
