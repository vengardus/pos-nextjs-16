"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { Modal } from "../../../../../components/common/modals/modal";

import { useCompanyStore } from "@/stores/company/company.store";
import { ListTable } from "../../../../../components/tables/list-table";

interface ListDefProps<Model, FormDataShape> {
  dataList: Model[];
  setDataList: (data: Model[]) => void;
  metadata: ModelMetadata;
  columnsDef: (options: {
    handleEditRecord: (id: string) => void;
    handleDeleteRecord: (id: string) => void;
  }) => any[];
  columnsResponsiveDef: any;
  FormComponent: React.ComponentType<{
    currentRow: Model | null;
    handleCloseForm: () => void;
    handleUpdateOptimistic: (data: Model) => void;
    metadata: ModelMetadata;
    data: FormDataShape;
  }>;
  deleteAction: (id: string) => Promise<ResponseAction>;
}

export const ListDef = <Model extends { id: string }, FormDataShape>({
  dataList,
  setDataList,
  metadata,
  columnsDef,
  columnsResponsiveDef,
  FormComponent,
  deleteAction,
}: ListDefProps<Model, FormDataShape>) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<Model | null>(null);
  const company = useCompanyStore((state) => state.company);

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const row = dataList.find((c) => c.id === id) ?? null;
    if (!row) {
      toast.error(`Error: No se pudo obtener ${metadata.singularName}`);
      return;
    }
    setCurrentRow(row);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await deleteAction(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
  };

  const handleUpdateOptimistic = (updated: Model) => {
    const updatedList = dataList.map((item) => (item.id === updated.id ? updated : item));
    setDataList(updatedList);
  };

  return (
    <>
      <ListTable<Model>
        data={dataList}
        columnsDef={columnsDef({
          handleEditRecord,
          handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={columnsResponsiveDef}
        modelLabels={metadata}
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)}>
          <FormComponent
            currentRow={currentRow}
            handleCloseForm={() => setIsShowForm(false)}
            handleUpdateOptimistic={handleUpdateOptimistic}
            metadata={metadata}
            data={{ companyId: company.id } as FormDataShape}
          />
        </Modal>
      )}
    </>
  );
};
