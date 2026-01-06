import 'server-only';

import { CacheConfig } from "@/server/next/cache.config";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { unstable_cache as cache } from "next/cache";

import { permissionGetAllByRoleUseCase } from "../../use-cases/permission.get-all-by-role.use-case";

export async function permissionGetAllByRoleCached(
  roleId: string
): Promise<ResponseAction> {
  console.log("cache=>permissionGetAllByRoleCached");
  const fn = cache(
    async () => {
      return permissionGetAllByRoleUseCase(roleId);
    },
    [`permissions-${roleId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [`permissions-${roleId}`],
    }
  );
  return fn();
}
