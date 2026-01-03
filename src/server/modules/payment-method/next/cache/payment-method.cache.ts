// "use cache";

import "server-only";

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { paymentMethodGetAllByCompanyUseCase } from "@/server/modules/payment-method/use-cases/payment-method.get-all-by-company.use-case";

// export const paymentMethodGetAllByCompanyCachedOld = async (
//   companyId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`payment-methods-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await paymentMethodGetAllByCompany(companyId);
// };

export async function paymentMethodGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>paymentMethodGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return paymentMethodGetAllByCompanyUseCase(companyId);
    },
    [`payment-methods-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`payment-methods-${companyId}`],
    }
  );
  return fn();
}
