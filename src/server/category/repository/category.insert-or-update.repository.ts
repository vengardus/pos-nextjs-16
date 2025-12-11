"use server";

import prisma from "@/infrastructure/db/prisma";
import type { Category } from "@/types/interfaces/category/category.interface";
import type { CategoryInput } from "@/lib/schemas/category.upsert.server.schema";

export const categoryInsertOrUpdateRepository = async (
  categoryInput: CategoryInput & { id?: string; imageUrl?: string }
): Promise<Category> => {
  console.log(
    "categoryInsertOrUpdateRepository action called with category:",
    categoryInput
  );

  // Determinar si es create or updatex
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
