import "server-only";

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { documentTypeGetAllByCompanyUseCase } from "@/server/modules/document-type/use-cases/document-type.get-all-by-company.use-case";

export async function documentTypeGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  console.log("cache=>documentTypeGetAllByCompanyCached");
  const fn = cache(
    async () => {
      return documentTypeGetAllByCompanyUseCase(companyId);
    },
    [`document-types-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`document-types-${companyId}`],
    }
  );

  return fn();
}
