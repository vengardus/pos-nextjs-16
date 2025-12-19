import "server-only";

import prisma from "@/server/db/prisma";
import type { Category } from "@/types/interfaces/category/category.interface";
import type { CategoryInput } from "@/server/category/domain/category.input.schema";

export const categoryInsertOrUpdateRepository = async (
  categoryInput: CategoryInput & { id?: string; imageUrl?: string | null }
): Promise<Category> => {

  const { id, imageUrl, ...rest } = categoryInput;
  // Determinar si es create or update
  if (id) {
    // Update
    return await prisma.categoryModel.update({
      where: {
        id,
      },
      data: {
        ...rest,
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      },
    });
  } else {
    // create
    return await prisma.categoryModel.create({
      data: {
        ...rest,
        imageUrl: imageUrl ?? null,
      },
    });
  }
};
