"use cache";

import 'server-only'

import { cacheLife, cacheTag } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { warehouseGetAllByProduct } from "./warehouse.get-all-by-product";

export const warehouseGetAllByProductCached = async (
  productId: string
): Promise<ResponseAction> => {
  cacheTag(`warehouses-${productId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await warehouseGetAllByProduct(productId);
};

// export async function warehouseGetAllByProductCached(productId: string): Promise<ResponseAction> {
//   // Aquí companyId está en scope, así que podemos usarlo en keyParts
//   console.log("pre-warehouseGetAllByProductCached");
//   const fn = cache(
//     async () => {
//       return warehouseGetAllByProduct(productId);
//     },
//     [`warehouses-${productId}`],
//     { revalidate: CacheConfig.CacheDurations.revalidate }
//   );
//   return fn();
// }
