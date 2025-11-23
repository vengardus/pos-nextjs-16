"use server";

import { revalidatePath, updateTag } from "next/cache";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Warehouse } from "@/types/interfaces/warehouse/warehouse.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

// Configuration Cloudinary

export const warehouseInsertMany = async (
  warehouse: Warehouse[]
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const restWarehouse = warehouse.map((warehouse) => {
    const { id, createdAt, ...rest } = warehouse;
    console.log(id, createdAt); //no usada intencionalmente
    return {
      ...rest,
    };
  });
  console.log({ restWarehouse });
  try {
    const proccesWarehouse = await prisma.warehouseModel.createMany({
      data: restWarehouse,
    });

    resp.data = proccesWarehouse;
    resp.success = true;

    updateTag(`warehouses-${restWarehouse[0].productId}`);
    revalidatePath("/config/products");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
