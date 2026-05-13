import "server-only";
import { unstable_cache as cache } from "next/cache";
import { logsGetAllUseCase } from "../../use-cases/logs.get-all.use-case";

export async function logsGetAllCached(page: number, pageSize: number) {
  const fn = cache(
    async () => logsGetAllUseCase(page, pageSize),
    [`logs-${page}-${pageSize}`],
    {
      revalidate: 60,
      tags: ["logs"],
    }
  );
  return fn();
}
