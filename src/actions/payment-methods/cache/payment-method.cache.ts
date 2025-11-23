import { cacheLife, cacheTag, unstable_cache as cache } from "next/cache";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { paymentMethodGetAllByCompany } from "../querys/payment-method.get-all-by-company.action";
import { CacheConfig } from "@/config/cache.config";

export const paymentMethodGetAllByCompanyCachedOld = async (
  companyId: string
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`payment-methods-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await paymentMethodGetAllByCompany(companyId);
};

export async function paymentMethodGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-paymentMethodGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return paymentMethodGetAllByCompany(companyId);
    },
    [`payment-methods-${companyId}`], // ahora sí existe
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
