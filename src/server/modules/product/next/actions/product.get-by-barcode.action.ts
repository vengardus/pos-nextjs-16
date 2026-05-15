"use server";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { productGetByBarcodeCached } from "../cache/product.get-by-barcode.cache";

export const productGetByBarcodeAction = async (
  barcode: string,
  companyId: string
): Promise<ResponseAction> => {
  return await productGetByBarcodeCached(barcode, companyId);
};
