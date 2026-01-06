//"use cache";

import "server-only";

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { productGetAllByCompanyUseCase } from "@/server/modules/product/use-cases/product.get-all-by-company.use-case";

// export const productGetAllByCompanyCached = async (
//   companyId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`products-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   console.log("products-cached", `products-${companyId}`);
//   return await productGetAllByCompany(companyId);
// };

export async function productGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>productGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return productGetAllByCompanyUseCase(companyId);
    },
    [`products-${companyId}`], // ahora sí existe
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`products-${companyId}`],
    }
  );
  return fn();
}
