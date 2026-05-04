"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaginationState, Updater } from "@tanstack/react-table";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { getModelMetadata } from "@/server/common/model-metadata";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { ListTable } from "@/components/tables/list-table";
import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import { clientSupplierDeleteByIdAction } from "@/server/modules/client-supplier/next/actions/client-supplier.delete-by-id.action";
import { useDebounce } from "@/hooks/debounce/use-debounce.hook";
import { AppConstants } from "@/shared/constants/app.constants";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";

interface ListDefProps {
  data: ClientSupplier[];
  companyId: string;
  pagination: any;
}

export const ListDef = ({ data, companyId, pagination }: ListDefProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<ClientSupplier | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 700);
  const isFirstMount = useRef(true);
  const searchParamsRef = useRef(searchParams);
  const clientSupplierMetadata = getModelMetadata("clientSupplier");

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

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

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const clientSupplier = data.find((c) => c.id === id) ?? null;
    if (!clientSupplier) {
      toast.error(
        `Error: No se pudo obtener ${clientSupplierMetadata.singularName}`
      );
      return;
    }
    setCurrentRow(clientSupplier);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await clientSupplierDeleteByIdAction(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
    await updateTagsAction([`clients-suppliers-${companyId}`]);
    startTransition(() => {
        router.refresh();
    });
  };

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

  const handleCloseForm = () => {
    setCurrentRow(null);
    setIsShowForm(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ListTable<ClientSupplier>
        data={data}
        columnsDef={ListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: clientSupplierMetadata.singularName,
          pluralName: clientSupplierMetadata.pluralName,
        }}
        manualPagination={true}
        pageCount={pagination?.totalPages ?? 1}
        paginationState={{ pageIndex, pageSize }}
        onPaginationChange={handlePaginationChange}
        manualFiltering={true}
        onGlobalFilterChange={(value: string) => setSearchValue(value)}
        onRefresh={async () => {
          await updateTagsAction([`clients-suppliers-${companyId}`]);
          startTransition(() => {
            router.refresh();
          });
        }}
        isLoading={isPending}
        stickyHeader={true}
      />

      {isShowForm && (
        <CustomSlideOver
          title={`${currentRow ? "Editar" : "Agregar"} ${clientSupplierMetadata.singularName}`}
          onClose={handleCloseForm}
        >
          <CustomForm
            currentRow={currentRow}
            companyId={companyId}
            handleCloseForm={handleCloseForm}
          />
        </CustomSlideOver>
      )}
    </div>
  );
};
