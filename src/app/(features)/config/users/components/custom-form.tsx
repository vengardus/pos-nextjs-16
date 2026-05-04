"use client";

import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import type { Role } from "@/server/modules/role/domain/role.interface";
import type { DocumentType } from "@/server/modules/document-type/domain/document-type.interface";
import { UserFormSchemaType } from "@/app/(features)/config/users/schemas/user-form.schema";
import { useUserForm } from "@/app/(features)/config/users/hooks/use-user-form";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { AppConstants } from "@/shared/constants/app.constants";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { mapRoleToCombobox } from "@/server/modules/role/utils/role.mapper";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";

interface CustomFormProps {
  currentRow: UserWithRelations | null;
  companyId: string;
  handleCloseForm: () => void;
  branches: Branch[];
  roles: Role[];
  documentTypes: DocumentType[];
}

export const CustomForm = ({
  currentRow,
  companyId,
  handleCloseForm,
  branches,
  roles,
  documentTypes,
}: CustomFormProps) => {
  const {
    form,
    handleSave: handleUserSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
    cashRegisters,
    setCashRegisters,
  } = useUserForm({
    currentRow,
    companyId,
  });

  const slideOver = useCustomSlideOver();

  useEffect(() => {
    slideOver?.setFooterContent(
      <div className="flex justify-end gap-2">
        <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
        {!(currentRow && currentRow.roleId === UserRole.GUEST) && (
          <ButtonSave isPending={isPending} type="submit" form="user-form" className="bg-neutralStrong" />
        )}
      </div>
    );
  }, [isPending, handleCloseForm, currentRow, slideOver]);

  const handleSave = async (values: UserFormSchemaType) => {
    setMessageGeneralError(null);
    await handleUserSave(values);
    if (!isNewRecord) handleCloseForm();
    else form.reset();
  };

  return (
    <Form {...form}>
      <form id="user-form" onSubmit={form.handleSubmit(handleSave)}>
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 py-2">
          <section className="flex flex-col gap-4">
            <InputFieldForm control={form.control} name="name" label="Nombre" placeholder="Ingrese su nombre" autoFocus />
            <InputFieldForm control={form.control} name="email" label="Email" placeholder="Ingrese email" />
            <InputFieldForm control={form.control} name="password" label="Password" placeholder="Ingrese password" type={form.getValues("password")!==AppConstants.DEFAULT_VALUES.messageUserPassword?"password":""} />
            <ComboboxForm
              control={form.control}
              name="documentTypeId"
              data={documentTypes.map((dt) => ({ label: dt.name, value: dt.id }))}
              label="Tipos de documentos"
              flexDirection="row"
              handleSelect={(value: string) => { form.setValue("documentTypeId", value); form.trigger("documentTypeId"); }}
              labelSelect="Seleccione un Tipo de Documento"
            />
            <InputFieldForm control={form.control} name="documentNumber" label="Numero documento" placeholder="Ingrese numero documento" />
          </section>
          <section className="h-full flex flex-col gap-4">
            <InputFieldForm control={form.control} name="phone" label="Telefono" placeholder="Ingrese numero telefono" />
            <InputFieldForm control={form.control} name="address" label="Direccion" placeholder="Ingrese dirección" />
            <ComboboxForm
              control={form.control}
              name="branchId"
              data={branches.map((item) => ({ label: item.name, value: item.id }))}
              label="Sucursal:"
              flexDirection="row"
              handleSelect={(value: string) => {
                form.setValue("branchId", value);
                form.trigger("branchId");
                const branch = branches.find((b) => b.id === value);
                setCashRegisters(branch?.CashRegister || []);
                form.setValue("cashRegisterId", "");
                form.trigger("cashRegisterId");
              }}
              labelSelect="Seleccione Sucursal"
            />
            <ComboboxForm
              control={form.control}
              name="cashRegisterId"
              data={cashRegisters.map((item) => ({ label: item.description, value: item.id }))}
              label="Caja:"
              flexDirection="row"
              handleSelect={(value: string) => { form.setValue("cashRegisterId", value); form.trigger("cashRegisterId"); }}
              labelSelect="Seleccione Caja"
            />
            <ComboboxForm
              control={form.control}
              name="roleId"
              data={mapRoleToCombobox(roles)}
              label="Rol"
              flexDirection="row"
              handleSelect={(value: string) => { form.setValue("roleId", value); form.trigger("roleId"); }}
              labelSelect="Seleccione un Rol"
            />
          </section>
        </div>
        {messageGeneralError && <p className="text-sm text-destructive mt-4">{messageGeneralError}</p>}
      </form>
    </Form>
  );
};
