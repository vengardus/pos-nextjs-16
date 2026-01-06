import 'server-only'

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { companyGetByUserUseCase } from "@/server/modules/company/use-cases/company.get-by-user.use-case";

export async function companyGetByUserCached(
  userId: string,
  role: string
): Promise<ResponseAction> {
  console.log("cache=>companyGetByUserCached");
  const fn = cache(
    async () => {
      return companyGetByUserUseCase(userId, role);
    },
    [`company-user-${userId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`company-user-${userId}`],
    }
  );
  return fn();
}
