import { unstable_cache } from "next/cache";
import { auditLogGetAllUseCase } from "../../use-cases/audit-log.get-all.use-case";

export const auditLogGetAllCached = unstable_cache(
  async () => {
    return await auditLogGetAllUseCase();
  },
  ["audit-logs"],
  {
    tags: ["audit-logs"],
    revalidate: 3600, // 1 hora
  }
);
