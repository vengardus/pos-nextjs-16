// "use cache";

import 'server-only'

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { warehouseGetAllByProduct } from "./warehouse.get-all-by-product";

// export const warehouseGetAllByProductCachedOld = async (
//   productId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`warehouses-${productId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await warehouseGetAllByProduct(productId);
// };

export async function warehouseGetAllByProductCached(productId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>warehouseGetAllByProductCached");
  const fn = cache(
    async () => {
      return warehouseGetAllByProduct(productId);
    },
    [`warehouses-${productId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`warehouses-${productId}`],
    }
  );
  return fn();
}
