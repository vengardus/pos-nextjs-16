"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Product } from "@/server/modules/product/domain/product.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { productInsertOrUpdateUseCase } from "@/server/modules/product/use-cases/product.insert-or-update.use-case";

export const productInsertOrUpdateAction = async (
  product: Product
): Promise<ResponseAction> => {
  if (!product) {
    const resp = initResponseAction();
    resp.message = "Producto inválido.";
    return resp;
  }

  console.time("product-insert-or-update");

  const resp = await productInsertOrUpdateUseCase(product);

  if (resp.success && resp.data) {
    console.log("updateTag", `products-${resp.data.companyId}`);
    updateTag(`products-${resp.data.companyId}`);
    updateTag(`top-selling-products-${resp.data.companyId}`);
    revalidatePath("/config/products");
    revalidatePath("/dashboard");
  }

  console.timeEnd("product-insert-or-update");

  return resp;
};
