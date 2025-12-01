// "use cache";

import 'server-only'

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { clientSupplierGetAllByCompany } from "./client-supplier.get-all-by-company";

// export const clientSupplierGetAllByCompanyCachedOld = async (
//   companyId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`clients-suppliers-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await clientSupplierGetAllByCompany(companyId);
// };

export async function clientSupplierGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>clientSupplierGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return clientSupplierGetAllByCompany(companyId);
    },
    [`clients-suppliers-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`clients-suppliers-${companyId}`],
    }
  );
  return fn();
}
