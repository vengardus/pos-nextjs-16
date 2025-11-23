"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types/interfaces/product/product.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { ProductBusiness } from "@/business/product.business";
import {
  productListColumnsDef,
  productListColumnsResponsiveDef,
} from "./product-list-columns-def";
import { ProductForm } from "./product-form";
import { ListTable } from "@/components/tables/list-table";
import { Modal } from "@/components/common/modals/modal";
import { productDeleteById } from "@/actions/products/mutations/product.delete-by-id.action";

interface ProductListProps {
  companyId: string;
  data: {
    products: Product[];
    categories: Category[];
    branches: Branch[];
  };
}
export const ProductList = ({ companyId, data }: ProductListProps) => {
  const { products, categories, branches } = data;
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleAddRecord = () => {
    setCurrentProduct(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const product = products.find((c) => c.id === id) ?? null;
    if (!product) {
      toast.error("Error: No se pudo obtener categoría");
      return;
    }
    setCurrentProduct(product);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await productDeleteById(id);
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
        columnsDef={productListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={productListColumnsResponsiveDef}
        modelLabels={{
          singularName: ProductBusiness.metadata.singularName,
          pluralName: ProductBusiness.metadata.pluralName,
        }}
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)} className="">
          <ProductForm
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
