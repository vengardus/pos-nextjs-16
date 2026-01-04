import 'server-only'

import prisma from "@/server/db/prisma";

export interface SaleTopSellingProductsQueryResult {
  topByQuantity: { productId: string; name: string; accumulated: number }[];
  topByAmount: { productId: string; name: string; accumulated: number }[];
}

export async function saleGetTopSellingProductsRepository(
  companyId: string,
  itemsByQuantity: number = 5,
  itemsByAmount: number = 10
): Promise<SaleTopSellingProductsQueryResult> {
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

  return {
    topByQuantity,
    topByAmount,
  };
}
