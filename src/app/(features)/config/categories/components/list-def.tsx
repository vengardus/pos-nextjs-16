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
import { categoryDeleteByIdAction } from "@/server/modules/category/next/actions/category.delete-by-id.action";
import type { Category } from "@/server/modules/category/domain/category.base.schema";
import { categoryCacheTag } from "@/server/modules/category/next/cache/category.tags";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "@/app/(features)/config/categories/components/list-columns-def";
import { CustomForm } from "@/app/(features)/config/categories/components/custom-form";

interface ListDefProps {
  data: Category[];
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
  const [currentRow, setCurrentRow] = useState<Category | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 700);
  const isFirstMount = useRef(true);
  const searchParamsRef = useRef(searchParams);

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
    const current = data.find((item) => item.id === id) ?? null;

    if (!current) {
      toast.error("No se pudo obtener la categoría seleccionada.");
      return;
    }

    setCurrentRow(current);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await categoryDeleteByIdAction(id);

    if (!resp.success) {
      toast.error("Error al eliminar la categoría.", {
        description: resp.message,
      });
      return;
    }

    toast.success("Categoría eliminada exitosamente.");
    await updateTagsAction([categoryCacheTag(companyId)]);
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
      <ListTable<Category>
        data={data}
        manualPagination={true}
        pageCount={pagination?.totalPages ?? -1}
        paginationState={{ pageIndex, pageSize }}
        onPaginationChange={handlePaginationChange}
        manualFiltering={true}
        onGlobalFilterChange={(value: string) => setSearchValue(value)}
        columnsDef={ListColumnsDef({
          handleEditRecord,
          handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: "Categoría",
          pluralName: "Categorías",
        }}
        onRefresh={async () => {
          await updateTagsAction([categoryCacheTag(companyId)]);
          startTransition(() => {
            router.refresh();
          });
        }}
        isLoading={isPending}
        stickyHeader={true}
      />

      {isShowForm && (
        <CustomSlideOver
          title={""}
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
