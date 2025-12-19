"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const categoryDeleteById = async (id: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const category = await prisma.categoryModel.findUnique({
      where: {
        id,
      },
    });
    if (!category) throw new Error("Category not found");
    if (category.isDefault)
      throw new Error("Category genérica no puede ser eliminada.");

    const categoryDelete = await prisma.categoryModel.delete({
      where: {
        id,
      },
    });
    resp.data = categoryDelete;
    resp.success = true;
    revalidatePath("/config/categories");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
