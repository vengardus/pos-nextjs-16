// "use cache";

import 'server-only'

// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { documentTypeGetAllByCompany } from "./document-type.get-all-by-company";

// export const documentTypeGetAllByCompanyCachedOld = async (
//   companyId: string
// ): Promise<ResponseAction> => {
//   cacheTag(`document-types-${companyId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await documentTypeGetAllByCompany(companyId);
// };

export async function documentTypeGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>documentTypeGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return documentTypeGetAllByCompany(companyId);
    },
    [`document-types-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`document-types-${companyId}`],
    }
  );
  return fn();
}
