
import 'server-only'

import prisma from "@/infrastructure/db/prisma";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Product } from "@/types/interfaces/product/product.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const productGetAllByCompany = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");

    const data = await prisma.productModel.findMany({
      where: { companyId },
      include: {
        Category: { select: { name: true } },
      },
    });

    resp.data = data.map((product) => ({
      ...product,
      categoryName: product.Category?.name,
    })) as Product[];
    resp.success = true;
    console.log("QUERY===>", `products-${companyId}`);
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
