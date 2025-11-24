"use server";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CartProduct } from "@/types/interfaces/sales/cart-product.interface";
import type { Sale } from "@/types/interfaces/sales/sale.interface";
import type { PosPayment } from "@/types/interfaces/pos-payment/pos-payment.interface";
import type { CashRegisterMovement } from "@/types/interfaces/cash-register-movement/cash-register-movement.interface";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { AppConstants } from "@/constants/app.constants";
import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";
import {  revalidatePath, updateTag } from "next/cache";
import { authGetSession } from "@/lib/data/auth/auth.get-session";

export const saleInsert = async (
  cartProducts: CartProduct[],
  sale: Sale,
  posPayment: PosPayment
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  console.log("sale", sale);

  try {
    // 0. authenticated check
    const respSession = await authGetSession();
    if (!respSession.data.isAuthenticated) throw new Error("Usuario no autenticado.");
    const userid = respSession.data.sessionUser.id;
    if (!userid) throw new Error("No hay sesión de usuario.");

    // 1. Validar todos los items tengan un producto asociado en la bd y copiarlos a products
    const productIds = Array.from(new Set(cartProducts.map((item) => item.id)));
    const products = await prisma.productModel.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    if (cartProducts.length !== products.length) {
      throw new Error("No se encontaron algunos produtos del carrito.");
    }

    // 2. Obtener cartProductsWithProduct
    const cartProductsWithProduct = cartProducts.map((cartProduct) => {
      const product = products.find((p) => p.id === cartProduct.id);
      if (!product)
        throw new Error(
          `Producto ${cartProduct.id} no encontrado al mapear cartProductsWithProduct.`
        );
      return {
        ...cartProduct,
        product,
      };
    });

    // 3. Obtener número total de items
    const countItems = cartProducts.length;

    // 4. Calcular subTotal, tax y total
    const subTotal = cartProductsWithProduct.reduce((accum, current) => {
      return accum + current.quantity * current.product.salePrice;
    }, 0);
    const tax = subTotal * (AppConstants.DEFAULT_VALUES.igv / 100);
    const total = parseFloat((subTotal * (1 + AppConstants.DEFAULT_VALUES.igv / 100)).toFixed(2));

    console.log("TOTALES", total, sale.totalAmount);
    if (total !== sale.totalAmount)
      throw new Error("El total de la venta no coincide con el total del cobro.");

    // 5. Crear la transacción de BD para grabar venta y stocks
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 5.1 Validar que todos los producto que manejan stock tengan un registro en warehouse
      const updateWarehousesPromises = cartProductsWithProduct
        .filter((item) => item.product.isInventoryControl)
        .map(async (item) => {
          try {
            const warehouse = await tx.warehouseModel.findUnique({
              where: {
                branchId_productId: {
                  branchId: sale.branchId,
                  productId: item.id,
                },
              },
            });

            if (!warehouse) {
              throw new Error(`No se encontró registro de stock en almacen para ${item.name}`);
            } else {
              // Verificar que el stock resultante será mayor o igual a 0
              const nuevoStock = warehouse.stock - item.quantity;
              if (nuevoStock < 0) {
                throw new Error(
                  `El stock de ${item.name} no puede ser menor que 0. Stock actual: ${warehouse.stock}, cantidad solicitada: ${item.quantity}`
                );
              }

              // Actualizar stock del producto
              return Promise.all([
                await tx.warehouseModel.update({
                  where: {
                    branchId_productId: {
                      branchId: sale.branchId,
                      productId: item.id,
                    },
                  },
                  data: {
                    stock: {
                      decrement: item.quantity,
                    },
                  },
                }),
                tx.kardexModel.create({
                  data: {
                    productId: item.id,
                    motive: "Agregar venta",
                    quantity: item.quantity,
                    type: "O",
                    cost: item.product.purchasePrice,
                    total: item.quantity * item.product.purchasePrice,
                    currentStock: warehouse.stock - item.quantity,
                    previousStock: warehouse.stock,
                    status: "A",
                    userId: userid,
                  },
                }),
              ]);
            }
          } catch (error) {
            getActionError(error);
            throw new Error(`${error}`); // Re-lanzar el error para que la transacción se revierta
          }
        });

      // Ejecutar las promesas
      const updateWarehouses = await Promise.all(updateWarehousesPromises);

      const promiseErrors = updateWarehouses.filter((item) => item === undefined);
      if (promiseErrors.length > 0) {
        throw new Error("Ocurrió un error al actualizar stocks");
      }

      // 5.3 Crear la orden - encabezado - detalle - pagos
      console.log("posPayment-SA", posPayment);

      const { id, ...restSale } = sale;
      console.log("OSALE", sale, id);
      const saleTx = await tx.saleModel.create({
        data: {
          ...restSale,
          userId: userid,
          productCount: countItems,
          subTotal,
          totalAmount: total,
          totalTaxes: tax,

          // detalles de la venta
          SaleDetail: {
            createMany: {
              data: cartProducts.map((item) => {
                const product = products.find((p) => p.id === item.id);
                if (!product) {
                  throw new Error(`Producto ${item.id} no existe.`);
                }
                if (product.salePrice <= 0) {
                  throw new Error(`Producto ${product.name} tiene un precio inválido.`);
                }
                return {
                  productId: item.id,
                  quantity: item.quantity,
                  salePrice: product.salePrice,
                  total: product.salePrice * item.quantity,
                  description: product.name,
                  purchasePrice: product.purchasePrice,
                  status: "A",
                };
              }),
            },
          },

          // detalles de los pagos
          CashRegisterMovement: {
            createMany: {
              data: posPayment.paymentDetails.map((item) => {
                return {
                  paymentMethodId: item.paymentMethodId,
                  amount: item.amount,
                  changeDue: item.paymentMethodCod === PaymentMethodEnum.CASH ? item.changeDue : 0,
                  description: `Pago de la venta con ${item.paymentMethodCod} ${
                    item.description ?? ""
                  }`,
                  userId: userid,
                  movementCategory: CashRegisterMovementCategoryEnum.PAYMENT_METHOD,
                  movementType: item.paymentMethodCod,
                  paymentMethodCod: item.paymentMethodCod,
                  cashRegisterClosureId: posPayment.cashRegisterClosureId,
                } as CashRegisterMovement;
              }),
            },
          },
        },
      });

      return {
        saleTx,
        updateWarehouses,
      };
    });

    resp.success = true;
    resp.data = {
      subTotal,
      tax,
      total,
      prismaTx: prismaTx,
      sale: prismaTx.saleTx,
    };

    console.log(
      "=>insert.sale",
      `cash-register-movements-totals-${
        posPayment.cashRegisterClosureId.length ? posPayment.cashRegisterClosureId : sale.companyId
      }`
    );

    // revalidates (lo hace en la subscripcion de cash-register-movements-totals)
    // updateTag(`cash-register-movements-totals-${
    //   posPayment.cashRegisterClosureId.length
    //     ? posPayment.cashRegisterClosureId
    //     : sale.companyId
    // }`);
    revalidatePath("/dashboard");
    updateTag(`cash-register-movements-totals-${sale.companyId}`);
  } catch (error) {
    resp.message = getActionError(error);
  }

  console.log(resp);

  return resp;
};
