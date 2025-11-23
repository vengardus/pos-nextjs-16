"use server";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import {
  cacheLife,
  cacheTag,
  unstable_cache as cache,
} from "next/cache";
import { permissionGetAllByRole } from "../querys/permission.get-all-by-role.action";
import { permissionGetAllByCompanyRoleCod } from "../querys/permission.get-all-by-company_rolecod.action";

export const permissionGetAllByRoleCachedOld = async (roleId: string): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`permissions-${roleId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await permissionGetAllByRole(roleId);
};

export const permissionGetAllByCompanyRoleCodCachedOld = async (
  companyId: string,
  roleCod: string
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(`permissions-${companyId}-${roleCod}`);
  cacheLife(CacheConfig.CacheDurations);
  return await permissionGetAllByCompanyRoleCod(companyId, roleCod);
};

//----
export async function permissionGetAllByRoleCached(roleId: string): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-permissionGetAllByRoleCached");
  const fn = cache(
    async () => {
      return permissionGetAllByRole(roleId);
    },
    [`permissions-${roleId}`], 
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}

export async function permissionGetAllByCompanyRoleCodCached(
  companyId: string,
  roleCod: string
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre-permissionGetAllByCompanyRoleCodCached");
  const fn = cache(
    async () => {
      return permissionGetAllByCompanyRoleCod(companyId, roleCod);
    },
    [`permissions-${companyId}-${roleCod}`],
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
