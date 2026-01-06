import 'server-only';

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { unstable_cache as cache } from "next/cache";

import { permissionGetAllByCompanyRoleCodUseCase } from "../../use-cases/permission.get-all-by-company-role-cod.use-case";

export async function permissionGetAllByCompanyRoleCodCached(
  companyId: string,
  roleCod: string
): Promise<ResponseAction> {
  console.log("cache=>permissionGetAllByCompanyRoleCodCached");
  const fn = cache(
    async () => {
      return permissionGetAllByCompanyRoleCodUseCase(companyId, roleCod);
    },
    [`permissions-${companyId}-${roleCod}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`permissions-${companyId}-${roleCod}`],
    }
  );
  return fn();
}
