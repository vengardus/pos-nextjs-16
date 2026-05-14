"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common/typography/page-header";
import { ListTable } from "@/components/tables/list-table";
import { AppConstants } from "@/shared/constants/app.constants";
import { columns } from "./components/audit-logs-columns-def";

export default function AuditLogsPageClient({
  data,
  pagination,
}: {
  data: any[];
  pagination?: { currentPage: number; totalPages: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pageIndex = Math.max(0, (pagination?.currentPage ?? 1) - 1);
  const pageSize = AppConstants.DEFAULT_PAGE_SIZE;

  const handlePaginationChange = (updater: any) => {
    const nextState =
      typeof updater === "function"
        ? updater({ pageIndex, pageSize })
        : updater;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (nextState.pageIndex + 1).toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const formattedData = data.map((log) => ({
    ...log,
    formattedDate: new Date(log.createdAt).toLocaleString(),
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader title="Logs de Auditoría" breadcrumb="SuperAdmin / Logs de Auditoría" />
      </div>
      <div className="flex-1 overflow-hidden">
        <ListTable<any>
          data={formattedData}
          manualPagination={true}
          pageCount={pagination?.totalPages ?? -1}
          paginationState={{ pageIndex, pageSize }}
          onPaginationChange={handlePaginationChange}
          columnsDef={columns}
          modelLabels={{
            singularName: "Log",
            pluralName: "Logs",
          }}
          isLoading={isPending}
          stickyHeader={true}
          handleAddRecord={() => {}}
          withCard={true}
          showAddButton={false}
        />
      </div>
    </div>
  );
}
