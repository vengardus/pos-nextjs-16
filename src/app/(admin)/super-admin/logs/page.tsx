import { logsGetAllCached } from "@/server/modules/logs/next/cache/logs.cache";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import LogsPage from "./page";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const pageSize = AppConstants.DEFAULT_PAGE_SIZE;

  const resp = await logsGetAllCached(page, pageSize);

  if (!resp.success) {
    return <ShowPageMessage errorMessage={resp.message} />;
  }

  return <LogsPage data={resp.data} pagination={resp.pagination} />;
}
