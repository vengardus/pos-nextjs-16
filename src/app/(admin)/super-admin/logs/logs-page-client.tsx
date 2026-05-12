"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common/typography/page-header";
import { ListTable } from "@/components/tables/list-table";
import { AppConstants } from "@/shared/constants/app.constants";
import { LogsColumnsDef } from "./components/logs-columns-def";

export default function LogsPageClient({
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

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-6">
        <PageHeader title="Logs del Sistema" breadcrumb={[{ label: "Super Admin" }, { label: "Logs" }]} />
      </div>
      <div className="flex-1 overflow-hidden p-4 min-h-0">
        <ListTable<any>
          data={data}
          manualPagination={true}
          pageCount={pagination?.totalPages ?? -1}
          paginationState={{ pageIndex, pageSize }}
          onPaginationChange={handlePaginationChange}
          columnsDef={LogsColumnsDef()}
          modelLabels={{
            singularName: "Log",
            pluralName: "Logs",
          }}
          isLoading={isPending}
          stickyHeader={true}
          handleAddRecord={() => {}}
        />
      </div>
    </div>
  );
}
