"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import type { Category } from "@/types/interfaces/category/category.interface";
import { ListColumnsDef, CustomListColumnsResponsiveDef } from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { Modal } from "../../../../../components/common/modals/modal";
import { ListTable } from "@/components/tables/list-table";
import { categoryDeleteById } from "@/actions/categories/category.delete-by-id.action";
import { updateTagsAction } from "@/server/next/actions/updateTags.action";
import { getModelMetadata } from "@/server/common/model-metadata";

interface ListDefProps {
  data: Category[];
  companyId: string;
}
export const ListDef = ({ data, companyId }: ListDefProps) => {
  const router = useRouter();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<Category | null>(null);
  const categoryMetadata = getModelMetadata("category");

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const currentRow = data.find((c) => c.id === id) ?? null;
    if (!currentRow) {
      toast.error(
        `Error: No se pudo obtener ${categoryMetadata.singularName}`
      );
      return;
    }
    setCurrentRow(currentRow);
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
        data={data}
        columnsDef={ListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: categoryMetadata.singularName,
          pluralName: categoryMetadata.pluralName,
        }}
        onRefresh={() => {    
          updateTagsAction([`categories-${companyId}`]);
          router.refresh()
        } 
      }
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)}>
          <CustomForm
            currentRow={currentRow}
            companyId={companyId}
            handleCloseForm={() => setIsShowForm(false)}
          />
        </Modal>
      )}
    </>
  );
};
