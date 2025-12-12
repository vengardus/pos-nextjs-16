import "server-only";

import prisma from "@/infrastructure/db/prisma";
import type { Category } from "@/types/interfaces/category/category.interface";
import type { CategoryInput } from "@/server/category/domain/category.input.schema";

export const categoryInsertOrUpdateRepository = async (
  categoryInput: CategoryInput & { id?: string; imageUrl: string | null }
): Promise<Category> => {

  // Determinar si es create or update
  if (categoryInput.id) {
    // Update
    return await prisma.categoryModel.update({
      where: {
        id: categoryInput.id,
      },
      data: {
        ...categoryInput,
      },
    });
  } else {
    // create
    return await prisma.categoryModel.create({
      data: {
        ...categoryInput,
        imageUrl: categoryInput.imageUrl ?? null,
      },
    });
  }
};
