"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { getModelMetadata } from "@/server/common/model-metadata";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { ListTable } from "@/components/tables/list-table";
import { Modal } from "@/components/common/modals/modal";
import { clientSupplierDeleteByIdAction } from "@/server/modules/client-supplier/next/actions/client-supplier.delete-by-id.action";

interface ListDefProps {
  data: ClientSupplier[];
  companyId: string;
}

export const ListDef = ({ data, companyId }: ListDefProps) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<ClientSupplier | null>(null);
  const clientSupplierMetadata = getModelMetadata("clientSupplier");

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const clientSupplier = data.find((c) => c.id === id) ?? null;
    if (!clientSupplier) {
      toast.error(
        `Error: No se pudo obtener ${clientSupplierMetadata.singularName}`
      );
      return;
    }
    setCurrentRow(clientSupplier);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await clientSupplierDeleteByIdAction(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
  };

  return (
    <>
      <ListTable<ClientSupplier>
        data={data}
        columnsDef={ListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: clientSupplierMetadata.singularName,
          pluralName: clientSupplierMetadata.pluralName,
        }}
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
