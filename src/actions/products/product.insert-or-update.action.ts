"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Product } from "@/types/interfaces/product/product.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

type ProductWithOptionalCategory = Product & { Category?: unknown };

export const productInsertOrUpdate = async (
  product: Product,
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, createdAt, barcode, internalCode, Category, categoryName, ...rest } =
    product as ProductWithOptionalCategory;

  console.time("product-insert-or-update");

  try {
    let proccesProduct: Product;

    if (id) {
      // UPDATE
      proccesProduct = await prisma.productModel.update({
        where: { id },
        data: {
          ...rest,
          barcode: barcode ?? null,
          internalCode: internalCode ?? null,
        },
      });
    } else {
      // CREATE
      proccesProduct = await prisma.productModel.create({
        data: {
          ...rest,
          barcode: barcode ?? null,
          internalCode: internalCode ?? null,
        },
      });
    }

    resp.data = proccesProduct;
    resp.success = true;

    // Revalidate cache / paths
    console.log("updateTag", `products-${proccesProduct.companyId}`);
    updateTag(`products-${proccesProduct.companyId}`);
    revalidatePath("/config/products");
  } catch (error) {
    resp.message = getActionError(error);
  }

  console.timeEnd("product-insert-or-update");

  return resp;
};
