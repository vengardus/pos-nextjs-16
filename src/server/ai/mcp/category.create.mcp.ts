import type { Category } from "@/types/interfaces/category/category.interface";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { categoryInsertOrUpdateUseCase } from "@/server/category/use-cases/category.insert-or-update.use-case";

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

  const response = await categoryInsertOrUpdateUseCase(category, []);

  if (!response.success)
    response.message = response.message ?? "Error al crear la categoría";

  return response;
};