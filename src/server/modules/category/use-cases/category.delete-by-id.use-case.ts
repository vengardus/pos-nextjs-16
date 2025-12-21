import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { categoryDeleteByIdRepository } from "../repository/category.delete-by-id.repository";
import { categoryGetByIdRepository } from "../repository/category.get-by-id.repository";

export const categoryDeleteByIdUseCase = async (
  id: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const category = await categoryGetByIdRepository(id);
    if (!category) throw new Error("Category not found");
    if (category.isDefault)
      throw new Error("Category genérica no puede ser eliminada.");

    const categoryDelete = await categoryDeleteByIdRepository(id);
    resp.data = categoryDelete;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
