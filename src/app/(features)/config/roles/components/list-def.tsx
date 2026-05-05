"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaginationState, Updater } from "@tanstack/react-table";
import { toast } from "sonner";

import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import { ListTable } from "@/components/tables/list-table";
import { useDebounce } from "@/hooks/debounce/use-debounce.hook";
import { AppConstants } from "@/shared/constants/app.constants";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";
import { roleDeleteByIdAction } from "@/server/modules/role/next/actions/role.delete-by-id.action";
import type { Role } from "@/server/modules/role/domain/role.interface";
import { roleCacheTag } from "@/server/modules/role/next/cache/role.tags";
import {
  createListColumnsDef,
  createListColumnsResponsiveDef,
} from "./create-list-columns-def";
import { CustomForm } from "./custom-form";
import type { Module } from "@/server/modules/permission/domain/module.interface";
import { getModelMetadata } from "@/server/common/model-metadata";

interface ListDefProps {
  data: Role[];
  companyId: string;
  modules: Module[];
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}

export const ListDef = ({ data, companyId, modules, pagination }: ListDefProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<Role | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const debouncedSearchValue = useDebounce(searchValue, 700);
  const isFirstMount = useRef(true);
  const searchParamsRef = useRef(searchParams);
  const roleMetadata = getModelMetadata("role");

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

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const current = data.find((item) => item.id === id) ?? null;

    if (!current) {
      toast.error(`Error: No se pudo obtener ${roleMetadata.singularName}`);
      return;
    }

    setCurrentRow(current);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await roleDeleteByIdAction(id);

    if (!resp.success) {
      toast.error("Error al eliminar el rol.", {
        description: resp.message,
      });
      return;
    }

    toast.success("Rol eliminado exitosamente.");
    await updateTagsAction([roleCacheTag(companyId)]);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleCloseForm = () => {
    setCurrentRow(null);
    setIsShowForm(false);
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

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ListTable<Role>
        data={data}
        manualPagination={true}
        pageCount={pagination?.totalPages ?? -1}
        paginationState={{ pageIndex, pageSize }}
        onPaginationChange={handlePaginationChange}
        manualFiltering={true}
        initialGlobalFilter={searchParams.get("search") ?? ""}
        onGlobalFilterChange={(value: string) => setSearchValue(value)}
        columnsDef={createListColumnsDef({
          handleEditRecord,
          handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={createListColumnsResponsiveDef}
        modelLabels={roleMetadata}
        onRefresh={async () => {
          await updateTagsAction([roleCacheTag(companyId)]);
          startTransition(() => {
            router.refresh();
          });
        }}
        isLoading={isPending}
        stickyHeader={true}
      />

      {isShowForm && (
        <CustomSlideOver
          title={`${currentRow ? "Editar" : "Agregar"} ${roleMetadata.singularName}`}
          onClose={handleCloseForm}
        >
          <CustomForm
            currentRow={currentRow}
            companyId={companyId}
            handleCloseForm={handleCloseForm}
            modules={modules}
          />
        </CustomSlideOver>
      )}
    </div>
  );
};
