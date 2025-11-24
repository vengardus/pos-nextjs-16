"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";
import { ClientSupplierBusiness } from "@/business/client-supplier.business";
import {
  clientSupplierListColumnsDef,
  clientSupplierListColumnsResponsiveDef,
} from "./client-supplier-list-columns-def";
import { ClientSupplierForm } from "./client-supplier-form";
import { ListTable } from "@/components/tables/list-table";
import { Modal } from "@/components/common/modals/modal";
import { clientSupplierDeleteById } from "@/actions/clients-suppliers/client-supplier.delete-by-id.action";

interface ClientSupplierListProps {
  clientssuppliers: ClientSupplier[];
  companyId: string;
}
export const ClientSupplierList = ({
  clientssuppliers,
  companyId,
}: ClientSupplierListProps) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentClientSupplier, setCurrentClientSupplier] =
    useState<ClientSupplier | null>(null);

  const handleAddRecord = () => {
    setCurrentClientSupplier(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const clientsupplier = clientssuppliers.find((c) => c.id === id) ?? null;
    if (!clientsupplier) {
      toast.error("Error: No se pudo obtener categoría");
      return;
    }
    setCurrentClientSupplier(clientsupplier);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await clientSupplierDeleteById(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
  };

  return (
    <>
      <ListTable<ClientSupplier>
        data={clientssuppliers}
        columnsDef={clientSupplierListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={clientSupplierListColumnsResponsiveDef}
        modelLabels={{
          singularName: ClientSupplierBusiness.metadata.singularName,
          pluralName: ClientSupplierBusiness.metadata.pluralName,
        }}
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)}>
          <ClientSupplierForm
            currentClientSupplier={currentClientSupplier}
            companyId={companyId}
            handleCloseForm={() => setIsShowForm(false)}
          />
        </Modal>
      )}
    </>
  );
};
