import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { saleGetTopSellingProducts } from "../querys/sale.get-top-selling-products.action";

export const saleGetTopSellingProductsCachedOld = async (
    companyId: string,
    itemsByQuantity: number = 5,
    itemsByAmount: number = 10
  ): Promise<ResponseAction> => {
    "use cache";
    cacheTag(`top-selling-products-${companyId}`);
    cacheLife(CacheConfig.CacheDurations);
    return await saleGetTopSellingProducts(companyId, itemsByQuantity, itemsByAmount);
  };

  export async function saleGetTopSellingProductsCached(companyId: string,
    itemsByQuantity: number = 5,
    itemsByAmount: number = 10): Promise<ResponseAction> {
    // Aquí companyId está en scope, así que podemos usarlo en keyParts
    console.log("pre-saleGetTopSellingProductsCached");
    const fn = cache(
      async () => {
        return saleGetTopSellingProducts(companyId, itemsByQuantity, itemsByAmount);
      },
      [`top-selling-products-${companyId}`], 
      { revalidate: CacheConfig.CacheDurations.revalidate }
    );
    return fn();
  }
  