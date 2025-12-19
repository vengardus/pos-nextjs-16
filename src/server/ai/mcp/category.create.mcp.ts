import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { categoryInsertOrUpdateUseCase } from "@/server/modules/category/use-cases/category.insert-or-update.use-case";
import { CategoryInput } from "@/server/modules/category/domain/category.input.schema";

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
  const category: CategoryInput = {
    name,
    color,
    companyId,
    isDefault: false,
  };

  const response = await categoryInsertOrUpdateUseCase(category, []);

  if (!response.success)
    response.message = response.message ?? "Error al crear la categoría";

  return response;
};