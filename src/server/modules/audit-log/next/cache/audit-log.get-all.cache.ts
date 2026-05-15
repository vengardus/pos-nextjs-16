import "server-only";
import { unstable_cache as cache } from "next/cache";
import { auditLogGetAllUseCase } from "../../use-cases/audit-log.get-all.use-case";

export async function auditLogGetAllCached(page: number, pageSize: number) {
  const fn = cache(
    async () => auditLogGetAllUseCase(page, pageSize),
    [`audit-logs-${page}-${pageSize}`],
    {
      revalidate: 60,
      tags: ["audit-logs"],
    }
  );
  return fn();
}
