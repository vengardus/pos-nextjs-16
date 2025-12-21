"use server";

import { revalidatePath } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { categoryDeleteByIdUseCase } from "@/server/modules/category/use-cases/category.delete-by-id.use-case";

export const categoryDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  const resp = await categoryDeleteByIdUseCase(id);

  if (resp.success) {
    revalidatePath("/config/categories");
  }

  return resp;
};
