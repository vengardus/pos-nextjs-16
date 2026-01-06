import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Warehouse } from "@/server/modules/warehouse/domain/warehouse.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { warehouseInsertManyRepository } from "../repository/warehouse.insert-many.repository";

export const warehouseInsertManyUseCase = async (
  warehouse: Warehouse[]
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  const restWarehouse = warehouse.map((warehouseItem) => {
    const { id, createdAt, ...rest } = warehouseItem;
    console.log(id, createdAt); //no usada intencionalmente
    return {
      ...rest,
    };
  });

  console.log({ restWarehouse });

  try {
    const proccesWarehouse = await warehouseInsertManyRepository(restWarehouse);

    resp.data = proccesWarehouse;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
