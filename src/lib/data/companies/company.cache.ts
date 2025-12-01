// "use cache";

import 'server-only'

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { companyGetByUser } from "./company.get-by-user";

// export async function companyGetByUserCachedOld(
//   userId: string,
//   role: string
// ): Promise<ResponseAction> {
//   cacheTag(`company-user-${userId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await companyGetByUser(userId, role);
// }

export async function companyGetByUserCached(
  userId: string,
  role: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log('cache=>companyGetByUserCached');
  const fn = cache(
    async () => {
      return companyGetByUser(userId, role)
    },
    [`company-user-${userId}`], // ahora sí existe
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`company-user-${userId}`],
    }
  )
  return fn()
}

