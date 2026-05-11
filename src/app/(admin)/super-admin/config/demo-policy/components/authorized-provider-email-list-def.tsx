"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListTable } from "@/components/tables/list-table";
import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import type { AuthorizedProviderEmail } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";
import { authorizedProviderEmailDeleteByIdAction } from "@/server/modules/authorized-provider-email/next/actions/authorized-provider-email.delete-by-id.action";
import {
  AuthorizedProviderEmailColumnsResponsiveDef,
  AuthorizedProviderEmailListColumnsDef,
} from "@/app/(admin)/super-admin/config/demo-policy/components/authorized-provider-email-list-columns-def";
import { AuthorizedProviderEmailCustomForm } from "@/app/(admin)/super-admin/config/demo-policy/components/authorized-provider-email-custom-form";

interface AuthorizedProviderEmailListDefProps {
  data: AuthorizedProviderEmail[];
}

export const AuthorizedProviderEmailListDef = ({
  data,
}: AuthorizedProviderEmailListDefProps) => {
  const router = useRouter();
  const [isShowForm, setIsShowForm] = useState(false);
  const [currentRow, setCurrentRow] = useState<AuthorizedProviderEmail | null>(
    null
  );

  const handleAddRecord = () => {
    setCurrentRow(null);
    setIsShowForm(true);
  };

  const handleEditRecord = (id: string) => {
    const current = data.find((item) => item.id === id) ?? null;
    if (!current) {
      toast.error("No se pudo obtener el email autorizado.");
      return;
    }
    setCurrentRow(current);
    setIsShowForm(true);
  };

  const handleDeleteRecord = async (id: string) => {
    const resp = await authorizedProviderEmailDeleteByIdAction(id);
    if (!resp.success) {
      toast.error("Error al eliminar", { description: resp.message });
      return;
    }

    toast.success("Eliminado exitosamente");
    router.refresh();
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
    setCurrentRow(null);
    router.refresh();
  };

  const slideOverTitle = currentRow
    ? "Editar Email Autorizado"
    : "Agregar Email Autorizado";

  return (
    <>
      <ListTable<AuthorizedProviderEmail>
        data={data}
        columnsDef={AuthorizedProviderEmailListColumnsDef({
          handleEditRecord,
          handleDeleteRecord,
        })}
        handleAddRecord={handleAddRecord}
        columnsResponsiveDef={AuthorizedProviderEmailColumnsResponsiveDef}
        modelLabels={{
          singularName: "Email Autorizado",
          pluralName: "Emails Autorizados",
        }}
        onRefresh={() => {
          router.refresh();
        }}
      />

      {isShowForm ? (
        <CustomSlideOver title={slideOverTitle} onClose={handleCloseForm}>
          <AuthorizedProviderEmailCustomForm
            key={currentRow?.id ?? "new"}
            currentRow={currentRow}
            handleCloseForm={handleCloseForm}
          />
        </CustomSlideOver>
      ) : null}
    </>
  );
};
