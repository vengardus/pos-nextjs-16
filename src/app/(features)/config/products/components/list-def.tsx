"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/server/modules/product/domain/product.interface";
import { getModelMetadata } from "@/server/common/model-metadata";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { ListTable } from "@/components/tables/list-table";
import { Modal } from "@/components/common/modals/modal";
import { productDeleteByIdAction } from "@/server/modules/product/next/actions/product.delete-by-id.action";
import { AppConstants } from "@/shared/constants/app.constants";

interface ListDefProps {
  companyId: string;
  data: Product[];
  pagination: any;
}
export const ListDef = ({ companyId, data, pagination }: ListDefProps) => {
  const router = useRouter();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const productMetadata = getModelMetadata("product");

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
  };

  return (
    <>
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
        paginationState={{
          pageIndex: (pagination?.currentPage ?? 1) - 1,
          pageSize: AppConstants.DEFAULT_PAGE_SIZE,
        }}
        onPaginationChange={(updater) => {
          if (typeof updater === "function") {
            const newState = updater({
              pageIndex: (pagination?.currentPage ?? 1) - 1,
              pageSize: AppConstants.DEFAULT_PAGE_SIZE,
            });
            router.push(`?page=${newState.pageIndex + 1}`);
          }
        }}
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)}>
          <CustomForm
            currentProduct={currentProduct}
            companyId={companyId}
            handleCloseForm={() => setIsShowForm(false)}
          />
        </Modal>
      )}
    </>
  );
};
