"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "@/types/interfaces/category/category.interface";
import { CategoryBusiness } from "@/business/category.business";
import {
  categoryListColumnsDef,
  categoryListColumnsResponsiveDef,
} from "./category-list-columns-def";
import { CategoryForm } from "./category-form";
import { Modal } from "../../../../../components/common/modals/modal";
import { ListTable } from "../../../../../components/tables/list-table";
import { categoryDeleteById } from "@/actions/categories/category.delete-by-id.action";

interface CategoryListProps {
  categories: Category[];
  companyId: string;
}
export const CategoryList = ({ categories, companyId }: CategoryListProps) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const handleAddRecord = () => {
    setCurrentCategory(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const category = categories.find((c) => c.id === id) ?? null;
    if (!category) {
      toast.error("Error: No se pudo obtener categoría");
      return;
    }
    setCurrentCategory(category);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await categoryDeleteById(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
  };

  return (
    <>
      <ListTable<Category>
        data={categories}
        columnsDef={categoryListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={categoryListColumnsResponsiveDef}
        modelLabels={{
          singularName: CategoryBusiness.metadata.singularName,
          pluralName: CategoryBusiness.metadata.pluralName,
        }}
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)}>
        {/* <div className="fixed inset-0 bg-background opacity-95 z-10 flex justify-center items-center top-16">
          <div className="fixed bg-background border  shadow-lg rounded-lg z-50 w-[80%] h-[80%]"> */}
            <CategoryForm
              currentCategory={currentCategory}
              companyId={companyId}
              handleCloseForm={() => setIsShowForm(false)}
            />
          {/* </div>
        </div> */}
        </Modal>
      )}
    </>
  );
};
