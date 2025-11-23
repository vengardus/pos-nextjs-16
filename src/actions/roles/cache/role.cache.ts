import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { roleGetAllByCompany } from "../querys/role.get-all-by-company.action";

export const roleGetAllByCompanyCachedOld = async (companyId: string): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`roles-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await roleGetAllByCompany(companyId);
};

export async function roleGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-roleGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return roleGetAllByCompany(companyId);
    },
    [`roles-${companyId}`], 
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
