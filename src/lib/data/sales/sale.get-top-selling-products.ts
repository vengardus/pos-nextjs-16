import 'server-only'

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { SummaryTopSellingProducts } from "@/types/interfaces/dashboard/summary-top-selling-products.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const saleGetTopSellingProducts = async (
  companyId: string,
  itemsByQuantity: number = 5,
  itemsByAmount: number = 10
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const topByQuantity = await prisma.$queryRaw<
      { productId: string; name: string; accumulated: number }[]
    >`
      SELECT 
        sd.product_id AS "productId",
        p.name AS "name",
        SUM(sd.quantity) AS "accumulated"
      FROM sale_details sd
      JOIN sales s ON sd.sale_id = s.id
      JOIN products p ON sd.product_id = p.id
      WHERE s.status = 'A' AND s.company_id = ${companyId}::UUID 
      GROUP BY sd.product_id, p.name
      ORDER BY accumulated DESC
      LIMIT ${itemsByQuantity};
    `;

    const topByAmount = await prisma.$queryRaw<
      { productId: string; name: string; accumulated: number }[]
    >`
      SELECT 
        sd.product_id AS "productId",
        p.name AS "name",
        SUM(sd.total) AS "accumulated"
      FROM sale_details sd
      JOIN sales s ON sd.sale_id = s.id
      JOIN products p ON sd.product_id = p.id
      WHERE s.status = 'A' AND s.company_id = ${companyId}::UUID 
      GROUP BY sd.product_id, p.name
      ORDER BY accumulated DESC
      LIMIT ${itemsByAmount};
    `;

    resp.success = true;
    resp.data = { 
        topByQuantity,
        topByAmount
    } as SummaryTopSellingProducts;

    console.log(`query=>saleGetTopSellingProducts`);
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
