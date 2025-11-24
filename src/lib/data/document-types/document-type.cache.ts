"use cache";

import 'server-only'

import { cacheLife, cacheTag } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { documentTypeGetAllByCompany } from "./document-type.get-all-by-company";

export const documentTypeGetAllByCompanyCached = async (
  companyId: string
): Promise<ResponseAction> => {
  cacheTag(`document-types-${companyId}`);
  cacheLife(CacheConfig.CacheDurations);
  return await documentTypeGetAllByCompany(companyId);
};

// export async function documentTypeGetAllByCompanyCached(
//   companyId: string
// ): Promise<ResponseAction> {
//   // Aquí companyId está en scope, así que podemos usarlo en keyParts
//   console.log("pre-documentTypeGetAllByCompanyCached");
//   const fn = cache(
//     async () => {
//       return documentTypeGetAllByCompany(companyId);
//     },
//     [`document-types-${companyId}`],
//     { revalidate: CacheConfig.CacheDurations.revalidate }
//   );
//   return fn();
// }
