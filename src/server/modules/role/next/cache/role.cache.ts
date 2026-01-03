// "use cache";

import "server-only";

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { roleGetAllByCompanyUseCase } from "@/server/modules/role/use-cases/role.get-all-by-company.use-case";

// export const roleGetAllByCompanyCachedOld = async (
//   companyId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`roles-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await roleGetAllByCompany(companyId);
// };

export async function roleGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>roleGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return roleGetAllByCompanyUseCase(companyId);
    },
    [`roles-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`roles-${companyId}`],
    }
  );
  return fn();
}
