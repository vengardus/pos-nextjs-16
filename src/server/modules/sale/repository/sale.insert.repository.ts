import "server-only";

import prisma from "@/server/db/prisma";
import type { CartProduct } from "@/server/modules/sale/domain/cart-product.interface";
import type { Sale } from "@/server/modules/sale/domain/sale.interface";
import type { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";
import type { CashRegisterMovement } from "@/server/modules/cash-register-movement/domain/cash-register-movement.interface";
import type { Product } from "@/server/modules/product/domain/product.interface";
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";
import { CashRegisterMovementCategoryEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-category.enum";

export type CartProductWithProduct = CartProduct & {
  product: Product;
};

export type SaleInsertRepositoryPayload = {
  cartProducts: CartProduct[];
  cartProductsWithProduct: CartProductWithProduct[];
  sale: Sale;
  posPayment: PosPayment;
  userId: string;
  subTotal: number;
  tax: number;
  total: number;
  countItems: number;
};

export const saleInsertFindProductsRepository = async (
  productIds: string[]
): Promise<Product[]> => {
  return await prisma.productModel.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
};

export const saleInsertRepository = async (
  payload: SaleInsertRepositoryPayload
): Promise<{ saleTx: Sale; updateWarehouses: unknown }> => {
  const {
    cartProducts,
    cartProductsWithProduct,
    sale,
    posPayment,
    userId,
    subTotal,
    tax,
    total,
    countItems,
  } = payload;

  return await prisma.$transaction(async (tx) => {
    const updateWarehousesPromises = cartProductsWithProduct
      .filter((item) => item.product.isInventoryControl)
      .map(async (item) => {
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
        }

        const nuevoStock = warehouse.stock - item.quantity;
        if (nuevoStock < 0) {
          throw new Error(
            `El stock de ${item.name} no puede ser menor que 0. Stock actual: ${warehouse.stock}, cantidad solicitada: ${item.quantity}`
          );
        }

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
              userId: userId,
            },
          }),
        ]);
      });

    const updateWarehouses = await Promise.all(updateWarehousesPromises);

    const promiseErrors = updateWarehouses.filter((item) => item === undefined);
    if (promiseErrors.length > 0) {
      throw new Error("Ocurrió un error al actualizar stocks");
    }

    console.log("posPayment-SA", posPayment);

    const { id, ...restSale } = sale;
    console.log("OSALE", sale, id);
    const saleTx = await tx.saleModel.create({
      data: {
        ...restSale,
        userId: userId,
        productCount: countItems,
        subTotal,
        totalAmount: total,
        totalTaxes: tax,

        SaleDetail: {
          createMany: {
            data: cartProducts.map((item) => {
              const product = cartProductsWithProduct.find((p) => p.id === item.id)?.product;
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

        CashRegisterMovement: {
          createMany: {
            data: posPayment.paymentDetails.map((item) => {
              return {
                paymentMethodId: item.paymentMethodId,
                amount: item.amount,
                changeDue:
                  item.paymentMethodCod === PaymentMethodEnum.CASH
                    ? item.changeDue
                    : 0,
                description: `Pago de la venta con ${item.paymentMethodCod} ${
                  item.description ?? ""
                }`,
                userId: userId,
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
      saleTx: saleTx as Sale,
      updateWarehouses,
    };
  });
};
