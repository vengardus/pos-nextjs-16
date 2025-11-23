import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";
import { branchGetAllByCompany } from "../querys/branch.get-all-by-company.action";

export const branchGetAllByCompanyCachedOld = async (companyId: string): Promise<ResponseAction> => {
    "use cache";
    cacheTag(`branches-${companyId}`);
    cacheLife(CacheConfig.CacheDurations);
    return await branchGetAllByCompany(companyId);
  };
  
  export async function branchGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
    // Aquí companyId está en scope, así que podemos usarlo en keyParts
    console.log("pre-branchGetAllByCompanyCached");
    const fn = cache(
      async () => {
        return branchGetAllByCompany(companyId);
      },
      [`branches-${companyId}`], 
      { revalidate: CacheConfig.CacheDurations.revalidate }
    );
    return fn();
  }
  