"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { PaginationState, Updater } from "@tanstack/react-table";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import type { Role } from "@/server/modules/role/domain/role.interface";
import type { DocumentType } from "@/server/modules/document-type/domain/document-type.interface";
import { getModelMetadata } from "@/server/common/model-metadata";
import { ListColumnsDef, CustomListColumnsResponsiveDef } from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { ListTable } from "@/components/tables/list-table";
import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import { userDeleteByIdAction } from "@/server/modules/user/next/actions/user.delete-by-id.action";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";
import { useDebounce } from "@/hooks/debounce/use-debounce.hook";
import { AppConstants } from "@/shared/constants/app.constants";

interface ListDefProps {
  data: UserWithRelations[];
  companyId: string;
  branches: Branch[];
  roles: Role[];
  documentTypes: DocumentType[];
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
  currentUserId: string;
  currentUserRole: string;
}

export const ListDef = ({
  data,
  companyId,
  branches,
  roles,
  documentTypes,
  pagination,
  currentUserId,
  currentUserRole,
}: ListDefProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<UserWithRelations | null>(null);
  const userMetadata = getModelMetadata("user");

  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const debouncedSearchValue = useDebounce(searchValue, 700);
  const isFirstMount = useRef(true);
  const searchParamsRef = useRef(searchParams);

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
    if (debouncedSearchValue) params.set("search", debouncedSearchValue);
    else params.delete("search");
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearchValue, pathname, router]);

  const pageIndex = Math.max(0, (pagination?.currentPage ?? 1) - 1);
  const pageSize = AppConstants.DEFAULT_PAGE_SIZE;

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    const nextState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
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
    const row = data.find((c) => c.id === id) ?? null;
    if (!row) {
      toast.error(`Error: No se pudo obtener ${userMetadata.singularName}`);
      return;
    }
    setCurrentRow(row);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await userDeleteByIdAction(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
    await updateTagsAction([`users-${companyId}`]);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ListTable<UserWithRelations>
        data={data}
        manualPagination={true}
        pageCount={pagination?.totalPages ?? -1}
        paginationState={{ pageIndex, pageSize }}
        onPaginationChange={handlePaginationChange}
        manualFiltering={true}
        initialGlobalFilter={searchParams.get("search") ?? ""}
        onGlobalFilterChange={(value: string) => setSearchValue(value)}
        columnsDef={ListColumnsDef({
          handleEditRecord,
          handleDeleteRecord,
          currentUserId,
          currentUserRole,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: userMetadata.singularName,
          pluralName: userMetadata.pluralName,
        }}
        onRefresh={async () => {
          await updateTagsAction([`users-${companyId}`]);
          startTransition(() => {
            router.refresh();
          });
        }}
        isLoading={isPending}
        stickyHeader={true}
      />

      {isShowForm && (
        <CustomSlideOver
          title={`${currentRow ? "Editar" : "Agregar"} ${userMetadata.singularName}`}
          onClose={() => setIsShowForm(false)}
        >
          <CustomForm
            currentRow={currentRow}
            companyId={companyId}
            handleCloseForm={() => setIsShowForm(false)}
            branches={branches}
            roles={roles}
            documentTypes={documentTypes}
          />
        </CustomSlideOver>
      )}
    </div>
  );
};
