import { productGetByBarcodeRepository } from "../repository/product.get-by-barcode.repository";
import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";

export const productGetByBarcodeUseCase = async (barcode: string, companyId: string) => {
  const resp = initResponseAction();

  try {
    const product = await productGetByBarcodeRepository(barcode, companyId);
    
    if (!product) {
      resp.success = false;
      resp.message = "Producto no encontrado";
      return resp;
    }

    resp.data = product;
    resp.success = true;
  } catch (error) {
    resp.success = false;
    resp.message = getActionError(error);
  }

  return resp;
};
