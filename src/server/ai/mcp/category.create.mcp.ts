import { categoryInsertOrUpdate } from "@/actions/categories/category.insert-or-update.action";
import type { Category } from "@/types/interfaces/category/category.interface";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";

type CreateCategoryPayload = {
  name: string;
  color: string;
  companyId: string;
};

export const categoryCreateWithMcp = async ({
  name,
  color,
  companyId,
}: CreateCategoryPayload): Promise<ResponseAction> => {
  const category: Category = {
    id: "",
    name,
    color,
    companyId,
    isDefault: false,
    createdAt: new Date(),
    imageUrl: null,
    updatedAt: null,
  };

  const response = await categoryInsertOrUpdate(category, []);

  if (!response.success)
    response.message = response.message ?? "Error al crear la categoría";

  return response;
};