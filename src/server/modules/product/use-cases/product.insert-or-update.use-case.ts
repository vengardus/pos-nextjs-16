import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Product } from "@/types/interfaces/product/product.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { productInsertOrUpdateRepository } from "../repository/product.insert-or-update.repository";

export const productInsertOrUpdateUseCase = async (
  product: Product
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const proccesProduct = await productInsertOrUpdateRepository(product);

    resp.data = proccesProduct;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
