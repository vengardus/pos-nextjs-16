import "server-only";

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { clientSupplierGetAllByCompanyUseCase } from "@/server/modules/client-supplier/use-cases/client-supplier.get-all-by-company.use-case";

export async function clientSupplierGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  console.log("cache=>clientSupplierGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return clientSupplierGetAllByCompanyUseCase(companyId);
    },
    [`clients-suppliers-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`clients-suppliers-${companyId}`],
    }
  );
  return fn();
}
