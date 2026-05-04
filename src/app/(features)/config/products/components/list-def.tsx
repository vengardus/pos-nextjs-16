"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaginationState, Updater } from "@tanstack/react-table";
import type { Product } from "@/server/modules/product/domain/product.interface";
import type { Category } from "@/server/modules/category/domain/category.base.schema";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import { getModelMetadata } from "@/server/common/model-metadata";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { ListTable } from "@/components/tables/list-table";
import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import { productDeleteByIdAction } from "@/server/modules/product/next/actions/product.delete-by-id.action";
import { AppConstants } from "@/shared/constants/app.constants";
import { useDebounce } from "@/hooks/debounce/use-debounce.hook";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";

interface ListDefProps {
  companyId: string;
  data: Product[];
  pagination: any;
  categories: Category[];
  branches: Branch[];
}
export const ListDef = ({ companyId, data, pagination, categories, branches }: ListDefProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 700);
  const isFirstMount = useRef(true);
  const searchParamsRef = useRef(searchParams);
  const productMetadata = getModelMetadata("product");

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
    setCurrentProduct(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const product = data.find((c) => c.id === id) ?? null;
    if (!product) {
      toast.error(
        `Error: No se pudo obtener ${productMetadata.singularName}`
      );
      return;
    }
    setCurrentProduct(product);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await productDeleteByIdAction(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
    await updateTagsAction([`products-${companyId}`]);
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

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ListTable<Product>
        data={data}
        columnsDef={ListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: productMetadata.singularName,
          pluralName: productMetadata.pluralName,
        }}
        manualPagination={true}
        pageCount={pagination?.totalPages ?? 1}
        paginationState={{ pageIndex, pageSize }}
        onPaginationChange={handlePaginationChange}
        manualFiltering={true}
        onGlobalFilterChange={(value: string) => setSearchValue(value)}
        onRefresh={async () => {
          await updateTagsAction([`products-${companyId}`]);
          startTransition(() => {
            router.refresh();
          });
        }}
        isLoading={isPending}
        stickyHeader={true}
      />

      {isShowForm && (
        <CustomSlideOver
            title={`${currentProduct ? "Editar" : "Agregar"} ${productMetadata.singularName}`}
            onClose={() => setIsShowForm(false)}
        >
          <CustomForm
            currentProduct={currentProduct}
            companyId={companyId}
            handleCloseForm={() => setIsShowForm(false)}
            categories={categories}
            branches={branches}
          />
        </CustomSlideOver>
      )}
    </div>
  );
};
