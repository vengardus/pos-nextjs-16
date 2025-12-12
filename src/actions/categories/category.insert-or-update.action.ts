"use server";

import { updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import { categoryInsertOrUpdateUseCase } from "@/server/category/use-cases/category.insert-or-update.use-case";

export const categoryInsertOrUpdateAction = async (
  category: Category,
  fileList: FileList | []
): Promise<ResponseAction> => {
  console.log("categoryInsertOrUpdateAction called with category:", category);
  const resp = await categoryInsertOrUpdateUseCase(category, fileList);
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
