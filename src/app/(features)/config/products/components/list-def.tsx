"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types/interfaces/product/product.interface";
import type { Category } from "@/server/modules/category/domain/category.base.schema";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import { getModelMetadata } from "@/server/common/model-metadata";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { ListTable } from "@/components/tables/list-table";
import { Modal } from "@/components/common/modals/modal";
import { productDeleteByIdAction } from "@/server/modules/product/next/actions/product.delete-by-id.action";

interface ListDefProps {
  companyId: string;
  data: {
    products: Product[];
    categories: Category[];
    branches: Branch[];
  };
}
export const ListDef = ({ companyId, data }: ListDefProps) => {
  const { products, categories, branches } = data;
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const productMetadata = getModelMetadata("product");

  const handleAddRecord = () => {
    setCurrentProduct(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const product = products.find((c) => c.id === id) ?? null;
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
        data={products}
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
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)}>
          <CustomForm
            currentProduct={currentProduct}
            companyId={companyId}
            handleCloseForm={() => setIsShowForm(false)}
            data={{ categories, branches }}
          />
        </Modal>
      )}
    </>
  );
};
