"use cache";

import 'server-only'

import { cacheLife, cacheTag } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { roleGetAllByCompany } from "./role.get-all-by-company";

export const roleGetAllByCompanyCached = async (
  companyId: string
): Promise<ResponseAction> => {
  cacheTag(`roles-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await roleGetAllByCompany(companyId);
};

// export async function roleGetAllByCompanyCached(companyId: string): Promise<ResponseAction> {
//   // Aquí companyId está en scope, así que podemos usarlo en keyParts
//   console.log("pre-roleGetAllByCompanyCached");
//   const fn = cache(
//     async () => {
//       return roleGetAllByCompany(companyId);
//     },
//     [`roles-${companyId}`],
//     { revalidate: CacheConfig.CacheDurations.revalidate }
//   );
//   return fn();
// }
