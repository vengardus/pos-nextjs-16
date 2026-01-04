import "server-only";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { unstable_cache as cache } from "next/cache";
import { branchGetAllUseCase } from "../../use-cases/branch.get-all.use-case";

export async function branchGetAllByCompanyCached(
  companyId: string
): Promise<ResponseAction> {
  console.log("cache=>branchGetAllByCompanyCached (modular)");
  const fn = cache(
    async () => {
      return branchGetAllUseCase(companyId);
    },
    [`branches-${companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`branches-${companyId}`],
    }
  );
  return fn();
}
