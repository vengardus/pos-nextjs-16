// "use cache";

import 'server-only'

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { saleGetTopSellingProducts } from "./sale.get-top-selling-products";

// export const saleGetTopSellingProductsCachedOld = async (
//   companyId: string,
//   itemsByQuantity: number = 5,
//   itemsByAmount: number = 10
// ): Promise<ResponseAction> => {
//   cacheTag(`top-selling-products-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await saleGetTopSellingProducts(companyId, itemsByQuantity, itemsByAmount);
// };

export async function saleGetTopSellingProductsCached(
  companyId: string,
  itemsByQuantity: number = 5,
  itemsByAmount: number = 10
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>saleGetTopSellingProductsCached");
  const fn = cache(
    async () => {
      return saleGetTopSellingProducts(companyId, itemsByQuantity, itemsByAmount);
    },
    [`top-selling-products-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`top-selling-products-${companyId}`],
    }
  );
  return fn();
}
  