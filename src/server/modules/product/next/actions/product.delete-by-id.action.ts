"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { productDeleteByIdUseCase } from "@/server/modules/product/use-cases/product.delete-by-id.use-case";

export const productDeleteByIdAction = async (
  id: string
): Promise<ResponseAction> => {
  if (!id) {
    return {
      success: false,
      message: "Id inválido.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await productDeleteByIdUseCase(id);

  if (resp.success && resp.data) {
    updateTag(`products-${resp.data.companyId}`);
    revalidatePath("/config/products");
  }

  return resp;
};
