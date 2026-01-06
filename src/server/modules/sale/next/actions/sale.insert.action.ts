"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { CartProduct } from "@/server/modules/sale/domain/cart-product.interface";
import type { Sale } from "@/server/modules/sale/domain/sale.interface";
import type { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";
import { saleInsertUseCase } from "@/server/modules/sale/use-cases/sale.insert.use-case";

export const saleInsertAction = async (
  cartProducts: CartProduct[],
  sale: Sale,
  posPayment: PosPayment
): Promise<ResponseAction> => {
  if (!sale || !posPayment) {
    return {
      success: false,
      message: "Datos de venta inválidos.",
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    };
  }

  const resp = await saleInsertUseCase(cartProducts, sale, posPayment);

  if (resp.success) {
    const closureTag = posPayment.cashRegisterClosureId?.length
      ? `cash-register-movements-totals-${posPayment.cashRegisterClosureId}`
      : null;

    console.log(
      "=>insert.sale",
      `cash-register-movements-totals-${
        posPayment.cashRegisterClosureId.length
          ? posPayment.cashRegisterClosureId
          : sale.companyId
      }`
    );

    console.log(`UPDATE_TAG:cash-register-movements-totals-${sale.companyId}`);

    if (closureTag) {
      updateTag(closureTag);
    }
    updateTag(`cash-register-movements-totals-${sale.companyId}`);
    revalidatePath("/dashboard");
  }

  return resp;
};
