"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { Modal } from "../../../../../components/common/modals/modal";
import { ListTable } from "@/components/tables/list-table";
import { paymentMethodDeleteById } from "@/actions/payment-methods/payment-method.delete-by-id.action";
import { getModelMetadata } from "@/server/common/model-metadata";

interface ListDefProps {
  data: PaymentMethod[];
  companyId: string;
}
export const ListDef = ({ data, companyId }: ListDefProps) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<PaymentMethod | null>(null);
  const paymentMethodMetadata = getModelMetadata("paymentMethod");

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const currentRow = data.find((c) => c.id === id) ?? null;
    if (!currentRow) {
      toast.error(
        `Error: No se pudo obtener ${paymentMethodMetadata.singularName}`
      );
      return;
    }
    setCurrentRow(currentRow);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await paymentMethodDeleteById(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
  };

  return (
    <>
      <ListTable<PaymentMethod>
        data={data}
        columnsDef={ListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: paymentMethodMetadata.singularName,
          pluralName: paymentMethodMetadata.pluralName,
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
