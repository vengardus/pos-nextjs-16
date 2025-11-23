import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";
import { userGetAllByCompany } from "../querys/user.get-all-by-company.action";

export const userGetAllByCompanyCachedOld = async (companyId: string): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`users-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await userGetAllByCompany(companyId);
};

export async function userGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-userGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return userGetAllByCompany(companyId);
    },
    [`users-${companyId}`], 
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
