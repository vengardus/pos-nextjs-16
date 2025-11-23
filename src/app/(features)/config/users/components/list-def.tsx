"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/types/interfaces/user/user.interface";
import { UserBusiness } from "@/business/user.business";
import {
  ListColumnsDef,
  CustomListColumnsResponsiveDef,
} from "./list-columns-def";
import { CustomForm } from "./custom-form";
import { useCompanyStore } from "@/stores/company/company.store";
import { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";
import { ListTable } from "@/components/tables/list-table";
import { Modal } from "@/components/common/modals/modal";
import { userDeleteById } from "@/actions/users/mutations/user.delete-by-id.action";

interface ListDefProps {
  data: UserWithRelations[];
  setDataList: (data: User[]) => void;
}
export const ListDef = ({ data, setDataList }: ListDefProps) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<UserWithRelations | null>(null);
  const company = useCompanyStore((state) => state.company);

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const currentRow = data.find((c) => c.id === id) ?? null;
    if (!currentRow) {
      toast.error(
        `Error: No se pudo obtener ${UserBusiness.metadata.singularName}`
      );
      return;
    }
    setCurrentRow(currentRow);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await userDeleteById(id);
    if (!resp.success) {
      toast.error("Error al eliminar: " + resp.message);
      return;
    }
    toast.success("Eliminado exitosamente");
  };

  const handleUpdateOptimistic = async (updatedUser: UserWithRelations) => {
    // 🔹 Optimistic update: actualiza el estado local antes del refetch
    const userUpdate = (data.map((user) => (user.id === updatedUser.id ? updatedUser : user))) as UserWithRelations[]
    data = {
      ...userUpdate
    }
    setDataList(userUpdate);
  }

  return (
    <>
      <ListTable<User>
        data={data}
        columnsDef={ListColumnsDef({
          handleEditRecord: handleEditRecord,
          handleDeleteRecord: handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={CustomListColumnsResponsiveDef}
        modelLabels={{
          singularName: UserBusiness.metadata.singularName,
          pluralName: UserBusiness.metadata.pluralName,
        }}
      />

      {isShowForm && (
        <Modal handleCloseForm={() => setIsShowForm(false)}>
          <CustomForm
            currentRow={currentRow}
            companyId={company.id}
            handleCloseForm={() => setIsShowForm(false)}
            handleUpdateOptimistic={(data) =>handleUpdateOptimistic(data)}
          />
        </Modal>
      )}
    </>
  );
};
