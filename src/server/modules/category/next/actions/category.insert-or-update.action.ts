"use server";

import { updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CategoryInput } from "@/server/modules/category/domain/category.input.schema";
import { categoryInsertOrUpdateUseCase } from "@/server/modules/category/use-cases/category.insert-or-update.use-case";

export const categoryInsertOrUpdateAction = async (
  formData: FormData
): Promise<ResponseAction> => {
  const rawCategory = formData.get("category");
  const category = rawCategory
    ? (JSON.parse(String(rawCategory)) as CategoryInput)
    : null;

  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File);

  if (!category) {
    return {
      success: false,
      message: "Categoría inválida.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  console.log("categoryInsertOrUpdateAction called with category:", category);
  const resp = await categoryInsertOrUpdateUseCase(category, files);
  if (resp.success && resp.data) {
    updateTag(`categories-${resp.data.companyId}`);
    console.log(`Action:Updated tag: categories-${resp.data.companyId}`);
  }
  // revalidateTag(
  //   `categories-${proccesCategory.companyId}`,
  //   CacheConfig.CacheDurations
  // );
  //revalidatePath("/config/categories");
  return resp;
};
