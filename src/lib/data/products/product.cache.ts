"use cache";

import 'server-only'

import {
  cacheLife,
  cacheTag,
} from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { productGetAllByCompany } from "./product.get-all-by-company";

export const productGetAllByCompanyCached = async (
  companyId: string
): Promise<ResponseAction> => {
  cacheTag(`products-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  console.log("products-cached", `products-${companyId}`);
  return await productGetAllByCompany(companyId);
};

// export async function productGetAllByCompanyCachedOld(companyId: string): Promise<ResponseAction> {
//   // Aquí companyId está en scope, así que podemos usarlo en keyParts
//   console.log("PRE-", `products-${companyId}`);
//   const fn = cache(
//     async () => {
//       return productGetAllByCompany(companyId);
//     },
//     [`products-${companyId}`], // ahora sí existe
//     { revalidate: CacheConfig.CacheDurations.revalidate }
//   );
//   return fn();
// }
