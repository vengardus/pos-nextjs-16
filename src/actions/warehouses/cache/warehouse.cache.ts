"use server";

import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { warehouseGetAllByProduct } from "../querys/warehouse.get-all-by-product.action";

export const warehouseGetAllByProductCachedOld = async (
  productId: string
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`warehouses-${productId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await warehouseGetAllByProduct(productId);
};

export async function warehouseGetAllByProductCached(productId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-warehouseGetAllByProductCached");
  const fn = cache(
    async () => {
      return warehouseGetAllByProduct(productId);
    },
    [`warehouses-${productId}`], 
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
