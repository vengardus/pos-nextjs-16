"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Warehouse } from "@/server/modules/warehouse/domain/warehouse.interface";
import { warehouseInsertManyUseCase } from "@/server/modules/warehouse/use-cases/warehouse.insert-many.use-case";

export const warehouseInsertManyAction = async (
  warehouse: Warehouse[]
): Promise<ResponseAction> => {
  if (!Array.isArray(warehouse) || warehouse.length === 0) {
    return {
      success: false,
      message: "Almacenes inválidos.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const productId = warehouse[0]?.productId;

  if (!productId) {
    return {
      success: false,
      message: "Producto inválido.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await warehouseInsertManyUseCase(warehouse);

  if (resp.success) {
    updateTag(`warehouses-${productId}`);
    revalidatePath("/config/products");
  }

  return resp;
};
