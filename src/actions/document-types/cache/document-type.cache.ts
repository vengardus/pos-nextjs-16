import {
  cacheLife,
  cacheTag,
  unstable_cache as cache,
} from "next/cache";

import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { CacheConfig } from "@/config/cache.config";
import { documentTypeGetAllByCompany } from "../querys/document-type.get-all-by-company.action";

export const documentTypeGetAllByCompanyCachedOld = async (
  companyId: string
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`document-types-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await documentTypeGetAllByCompany(companyId);
};

export async function documentTypeGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-documentTypeGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return documentTypeGetAllByCompany(companyId);
    },
    [`document-types-${companyId}`],
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
