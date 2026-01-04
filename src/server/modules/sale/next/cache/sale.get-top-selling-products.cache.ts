import 'server-only'

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { saleGetTopSellingProductsUseCase } from "../../use-cases/sale.get-top-selling-products.use-case";

export async function saleGetTopSellingProductsCached(
  companyId: string,
  itemsByQuantity: number = 5,
  itemsByAmount: number = 10
): Promise<ResponseAction> {
  console.log("cache=>saleGetTopSellingProductsCached");
  const fn = cache(
    async () => {
      return saleGetTopSellingProductsUseCase(
        companyId,
        itemsByQuantity,
        itemsByAmount
      );
    },
    [`top-selling-products-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`top-selling-products-${companyId}`],
    }
  );
  return fn();
}
