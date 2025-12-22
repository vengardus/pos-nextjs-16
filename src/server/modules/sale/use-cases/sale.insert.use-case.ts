import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CartProduct } from "@/types/interfaces/sales/cart-product.interface";
import type { Sale } from "@/types/interfaces/sales/sale.interface";
import type { PosPayment } from "@/types/interfaces/pos-payment/pos-payment.interface";
import { AppConstants } from "@/shared/constants/app.constants";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { authGetSession } from "@/lib/data/auth/auth.get-session";
import {
  saleInsertFindProductsRepository,
  saleInsertRepository,
} from "../repository/sale.insert.repository";

export const saleInsertUseCase = async (
  cartProducts: CartProduct[],
  sale: Sale,
  posPayment: PosPayment
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  console.log("sale", sale);

  try {
    const respSession = await authGetSession();
    if (!respSession.data.isAuthenticated) throw new Error("Usuario no autenticado.");
    const userId = respSession.data.sessionUser.id;
    if (!userId) throw new Error("No hay sesión de usuario.");

    const productIds = Array.from(new Set(cartProducts.map((item) => item.id)));
    const products = await saleInsertFindProductsRepository(productIds);
    if (cartProducts.length !== products.length) {
      throw new Error("No se encontaron algunos produtos del carrito.");
    }

    const cartProductsWithProduct = cartProducts.map((cartProduct) => {
      const product = products.find((item) => item.id === cartProduct.id);
      if (!product)
        throw new Error(
          `Producto ${cartProduct.id} no encontrado al mapear cartProductsWithProduct.`
        );
      return {
        ...cartProduct,
        product,
      };
    });

    const countItems = cartProducts.length;

    const subTotal = cartProductsWithProduct.reduce((accum, current) => {
      return accum + current.quantity * current.product.salePrice;
    }, 0);
    const tax = subTotal * (AppConstants.DEFAULT_VALUES.igv / 100);
    const total = parseFloat(
      (subTotal * (1 + AppConstants.DEFAULT_VALUES.igv / 100)).toFixed(2)
    );

    console.log("TOTALES", total, sale.totalAmount);
    if (total !== sale.totalAmount)
      throw new Error("El total de la venta no coincide con el total del cobro.");

    const prismaTx = await saleInsertRepository({
      cartProducts,
      cartProductsWithProduct,
      sale,
      posPayment,
      userId,
      subTotal,
      tax,
      total,
      countItems,
    });

    resp.success = true;
    resp.data = {
      subTotal,
      tax,
      total,
      prismaTx: prismaTx,
      sale: prismaTx.saleTx,
    };
  } catch (error) {
    resp.message = getActionError(error);
  }

  console.log(resp);

  return resp;
};
