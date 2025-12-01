// "use cache";

import 'server-only'

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
// import { cacheLife, cacheTag } from "next/cache";
import { unstable_cache as cache } from "next/cache";

import { permissionGetAllByCompanyRoleCod } from "./permission.get-all-by-company_rolecod";
import { permissionGetAllByRole } from "./permission.get-all-by-role";

// export const permissionGetAllByRoleCachedOld = async (roleId: string): Promise<ResponseAction> => {
//   cacheTag(`permissions-${roleId}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await permissionGetAllByRole(roleId);
// };

// export const permissionGetAllByCompanyRoleCodCachedOld = async (
//   companyId: string,
//   roleCod: string
// ): Promise<ResponseAction> => {
//   cacheTag(`permissions-${companyId}-${roleCod}`);
//   cacheLife(CacheConfig.CacheDurations);
//   return await permissionGetAllByCompanyRoleCod(companyId, roleCod);
// };

//----
export async function permissionGetAllByRoleCached(roleId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>permissionGetAllByRoleCached");
  const fn = cache(
    async () => {
      return permissionGetAllByRole(roleId);
    },
    [`permissions-${roleId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`permissions-${roleId}`],
    }
  );
  return fn();
}

export async function permissionGetAllByCompanyRoleCodCached(
  companyId: string,
  roleCod: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("cache=>permissionGetAllByCompanyRoleCodCached");
  const fn = cache(
    async () => {
      return permissionGetAllByCompanyRoleCod(companyId, roleCod);
    },
    [`permissions-${companyId}-${roleCod}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`permissions-${companyId}-${roleCod}`],
    }
  );
  return fn();
}
