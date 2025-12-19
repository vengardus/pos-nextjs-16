// "use cache";
import "server-only";

import { CacheConfig } from "@/server/next/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { userGetAllByCompany } from "./user.get-all-by-company";
import { userGetByColumn } from "./user.get-by-column";

// export const userGetAllByCompanyCachedOld = async (companyId: string): Promise<ResponseAction> => {
//   cacheTag(`users-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await userGetAllByCompany(companyId);
// };

export async function userGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>userGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return userGetAllByCompany(companyId);
    },
    [`users-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`users-${companyId}`],
    }
  );
  return fn();
}

export async function userGetByColumnCached(column: string, value: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>userGetByColumnCached");
  const fn = cache(
    async () => {
      return userGetByColumn(column, value);
    },
    [`users-${column}-${value}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`users-${column}-${value}`],
    }
  );
  return fn();
}
