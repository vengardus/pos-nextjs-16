// "use cache";

import "server-only";

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { paymentMethodGetAllByCompanyUseCase } from "@/server/modules/payment-method/use-cases/payment-method.get-all-by-company.use-case";

// export const paymentMethodGetAllByCompanyCachedOld = async (
//   companyId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`payment-methods-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await paymentMethodGetAllByCompany(companyId);
// };

export async function paymentMethodGetAllByCompanyCached(
  companyId: string,
  page: number = 1,
  pageSize: number = 50,
  search?: string
): Promise<ResponseAction> {
  console.log("cache=>paymentMethodGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return paymentMethodGetAllByCompanyUseCase(companyId, page, pageSize, search);
    },
    [`payment-methods-${companyId}-${page}-${pageSize}-${search || "all"}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`payment-methods-${companyId}`],
    }
  );
  return fn();
}
