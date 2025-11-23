"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Product } from "@/types/interfaces/product/product.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

type ProductWithOptionalCategory = Product & { Category?: unknown };

export const productInsertOrUpdate = async (
  product: Product,
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, barcode, internalCode, Category, categoryName, ...rest } = product as ProductWithOptionalCategory;

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let proccesProduct: Product = product;
      // Determinar si es create or update
      if (id) {
        // Update
        proccesProduct = await prisma.productModel.update({
          where: {
            id,
          },
          data: {
            ...rest,
            barcode: barcode?? null,          // asegura de grabar null si es undefined
            internalCode: internalCode?? null // asegura de grabar null si es undefined
          },
        });
      } else {
        // create
        proccesProduct = await prisma.productModel.create({
          data: {
            ...rest,
            barcode: barcode?? null,
            internalCode: internalCode?? null
          },
        });
      }

      return {
        proccesProduct,
      };
    });
    resp.data = prismaTx.proccesProduct;
    resp.success = true;

    console.log("updateTag", `products-${prismaTx.proccesProduct.companyId}`);
    // revalidates
    updateTag(`products-${prismaTx.proccesProduct.companyId}`);
    // revalidatePath("/pos");
    revalidatePath("/config/products");

  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

