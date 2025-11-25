// "use cache";
import "server-only";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { userGetAllByCompany } from "./user.get-all-by-company";

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
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
