import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { clientSupplierGetAllByCompany } from "../querys/client-supplier.get-all-by-company.action";

export const clientSupplierGetAllByCompanyCachedOld = async (
  companyId: string
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`clients-suppliers-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await clientSupplierGetAllByCompany(companyId);
};

export async function clientSupplierGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-clientSupplierGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return clientSupplierGetAllByCompany(companyId);
    },
    [`clients-suppliers-${companyId}`], 
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
