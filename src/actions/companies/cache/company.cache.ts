"use server";

import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";
import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { companyGetByUser } from "../querys/company.get-by-user.action";

export async function companyGetByUserCachedOld(
  userId: string,
  role: string
): Promise<ResponseAction> {
  "use cache";
  cacheTag(`company-user-${userId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await companyGetByUser(userId, role);
}
export async function companyGetByUserCached(
  userId: string,
  role: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log('pre-companyGetByUserCached');
  const fn = cache(
    async () => {
      return companyGetByUser(userId, role)
    },
    [`company-user-${userId}`], // ahora sí existe
    { revalidate: CacheConfig.CacheDurations.revalidate,
      
     }
  )
  return fn()
}

