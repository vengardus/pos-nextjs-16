import "server-only";
import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { categoryGetAllByCompanyUseCase } from "@/server/modules/category/use-cases/category.get-all-by-company.use-case";
import { categoryCacheTag } from "@/server/modules/category/next/cache/category.tags";

const CATEGORY_GET_ALL_CACHE_VERSION = "v2";

export async function categoryGetAllByCompanyCached(
  companyId: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<ResponseAction> {
  const tag = categoryCacheTag(companyId);

  const fn = cache(
    async () => {
      return categoryGetAllByCompanyUseCase(companyId, page, limit, search);
    },
    [tag, String(page), String(limit), String(search), CATEGORY_GET_ALL_CACHE_VERSION],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [tag],
    }
  );
  return fn();
}
