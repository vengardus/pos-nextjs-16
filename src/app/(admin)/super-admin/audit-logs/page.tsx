import { auditLogGetAllCached } from "@/server/modules/audit-log/next/cache/audit-log.get-all.cache";
import { AppConstants } from "@/shared/constants/app.constants";
import AuditLogsPageClient from "./audit-logs-page-client";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) ?? "1");
  const pageSize = AppConstants.DEFAULT_PAGE_SIZE;

  const resp = await auditLogGetAllCached(page, pageSize);

  if (!resp.success) {
    return <ShowPageMessage errorMessage={resp.message ?? "Error"} />;
  }

  return <AuditLogsPageClient data={resp.data} pagination={resp.pagination} />;
}
