"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import type { PaginationState, Updater } from "@tanstack/react-table";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import { ListTable } from "@/components/tables/list-table";
import { useDebounce } from "@/hooks/debounce/use-debounce.hook";
import { paymentMethodDeleteByIdAction } from "@/server/modules/payment-method/next/actions/payment-method.delete-by-id.action";
import { getModelMetadata } from "@/server/common/model-metadata";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";
import { AppConstants } from "@/shared/constants/app.constants";

interface ListDefProps {
  data: PaymentMethod[];
  companyId: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}
export const ListDef = ({ data, companyId, pagination }: ListDefProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<PaymentMethod | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const debouncedSearchValue = useDebounce(searchValue, 700);
  const isFirstMount = useRef(true);
  const searchParamsRef = useRef(searchParams);
  const paymentMethodMetadata = getModelMetadata("paymentMethod");

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const currentSearch = searchParamsRef.current.get("search") ?? "";
    if (debouncedSearchValue === currentSearch) return;

    const params = new URLSearchParams(searchParamsRef.current.toString());

    if (debouncedSearchValue) {
      params.set("search", debouncedSearchValue);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearchValue, pathname, router]);

  const pageIndex = Math.max(0, (pagination?.currentPage ?? 1) - 1);
  const pageSize = AppConstants.DEFAULT_PAGE_SIZE;

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
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

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const currentRow = data.find((c) => c.id === id) ?? null;
    if (!currentRow) {
      toast.error(
        `Error: No se pudo obtener ${paymentMethodMetadata.singularName}`
      );
      return;
    }
    setCurrentRow(currentRow);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await paymentMethodDeleteByIdAction(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
    await updateTagsAction([`payment-methods-${companyId}`]);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ListTable<PaymentMethod>
        data={data}
        manualPagination={true}
        pageCount={pagination?.totalPages ?? -1}
        paginationState={{ pageIndex, pageSize }}
        onPaginationChange={handlePaginationChange}
        manualFiltering={true}
        initialGlobalFilter={searchParams.get("search") ?? ""}
        onGlobalFilterChange={(value: string) => setSearchValue(value)}
        columnsDef={ListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: paymentMethodMetadata.singularName,
          pluralName: paymentMethodMetadata.pluralName,
        }}
        onRefresh={async () => {
          await updateTagsAction([`payment-methods-${companyId}`]);
          startTransition(() => {
            router.refresh();
          });
        }}
        isLoading={isPending}
        stickyHeader={true}
      />

      {isShowForm && (
        <CustomSlideOver
          title={`${currentRow ? "Editar" : "Agregar"} ${paymentMethodMetadata.singularName}`}
          onClose={() => setIsShowForm(false)}
        >
          <CustomForm
            currentRow={currentRow}
            companyId={companyId}
            handleCloseForm={() => setIsShowForm(false)}
          />
        </CustomSlideOver>
      )}
    </div>
  );
};
