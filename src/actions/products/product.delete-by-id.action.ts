"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { updateTag } from "next/cache";

export const productDeleteById = async (id: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const productDelete = await prisma.productModel.delete({
      where: {
        id,
      },
    });
    resp.data = productDelete;
    resp.success = true;
    updateTag(`products-${productDelete.companyId}`);
    revalidatePath("/config/products");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
