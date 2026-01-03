//"use cache";

import "server-only";

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { productGetAllByCompany } from "./product.get-all-by-company";

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
      return productGetAllByCompany(companyId);
    },
    [`products-${companyId}`], // ahora sí existe
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`products-${companyId}`],
    }
  );
  return fn();
}
