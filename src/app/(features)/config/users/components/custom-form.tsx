"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { User } from "@/types/interfaces/user/user.interface";
import { UserFormSchemaType } from "@/app/(features)/config/users/schemas/user-form.schema";
import { useUserForm } from "@/app/(features)/config/users/hooks/use-user-form";
import { UserBusiness } from "@/business/user.business";
import { useDocumentTypeStore } from "@/stores/document-type/document-type.store";
import { useBranchStore } from "@/stores/branch/branch.store";
import { UserRole } from "@/types/enums/user-role.enum";
import { AppConstants } from "@/constants/app.constants";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { mapRoleToCombobox } from "@/mappers/role.mapper";

interface CustomFormProps {
  currentRow: User | null;
  companyId: string;
  handleCloseForm: () => void;
  handleUpdateOptimistic: (currentRow: User) => void;
}

export const CustomForm = ({
  currentRow,
  companyId,
  handleCloseForm,
  handleUpdateOptimistic,
}: CustomFormProps) => {
  const branches = useBranchStore((state) => state.branches);
  const documentTypes = useDocumentTypeStore((state) => state.documentTypes);
  const {
    form,
    handleSave: handleUserSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
    cashRegisters,
    setCashRegisters,
    roles,
  } = useUserForm({
    currentRow,
    companyId,
  });

  const handleSave = async (values: UserFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleUserSave(values);
    console.log("resp::::::", resp.data);
    if (resp.success) postSave(resp.data!);
  };

  const postSave = (currentRow: User) => {
    form.reset();
    setMessageGeneralError(null);
    if (!isNewRecord) {
      handleUpdateOptimistic(currentRow);
      handleCloseForm();
    }
  };

  return (
    <div className="">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>{`${!isNewRecord ? "Editar" : "Agregar"} ${
            UserBusiness.metadata.singularName
          }`}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent className="grid w-full items-center gap-10 lg:grid-cols-2">
              <section className="flex flex-col gap-4">
                <InputFieldForm
                  control={form.control}
                  name="name"
                  label="Nombre"
                  placeholder="Ingrese su nombre"
                  autoFocus
                />
                <InputFieldForm
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Ingrese email"
                />
                <InputFieldForm
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Ingrese password"
                  type={form.getValues("password")!==AppConstants.DEFAULT_VALUES.messageUserPassword?"password":""}
                />
                <ComboboxForm
                  control={form.control}
                  name="documentTypeId"
                  data={documentTypes.map((documentType) => ({
                    label: documentType.name,
                    value: documentType.id,
                  }))}
                  label="Tipos de documentos"
                  flexDirection="row"
                  handleSelect={(value: string) => {
                    form.setValue("documentTypeId", value);
                    form.trigger("documentTypeId");
                  }}
                  labelSelect="Seleccione un Tipo de Documento"
                />
                <InputFieldForm
                  control={form.control}
                  name="documentNumber"
                  label="Numero documento"
                  placeholder="Ingrese numero documento"
                />
              </section>
              <section className="h-full flex flex-col gap-4">
                <InputFieldForm
                  control={form.control}
                  name="phone"
                  label="Telefono"
                  placeholder="Ingrese numero telefono"
                />
                <InputFieldForm
                  control={form.control}
                  name="address"
                  label="Direccion"
                  placeholder="Ingrese dirección"
                />
                <ComboboxForm
                  control={form.control}
                  name="branchId"
                  data={branches.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  label="Sucursal:"
                  flexDirection="row"
                  handleSelect={(value: string) => {
                    form.setValue("branchId", value);
                    form.trigger("branchId");

                    const branch = branches.filter(
                      (branch) => branch.id === value
                    );
                    console.log("branch::::", branch);
                    if (branch.length > 0 && branch[0].CashRegister!.length > 0)
                      setCashRegisters(branch[0].CashRegister || []);
                    else {
                      setCashRegisters([]);
                      form.setValue("cashRegisterId", "");
                    }
                    form.trigger("cashRegisterId");
                  }}
                  labelSelect="Seleccione Sucursal"
                />

                <ComboboxForm
                  control={form.control}
                  name="cashRegisterId"
                  data={cashRegisters.map((item) => ({
                    label: item.description,
                    value: item.id,
                  }))}
                  label="Caja:"
                  flexDirection="row"
                  handleSelect={(value: string) => {
                    form.setValue("cashRegisterId", value);
                    form.trigger("cashRegisterId");
                  }}
                  labelSelect="Seleccione Caja"
                />

                <ComboboxForm
                  control={form.control}
                  name="roleId"
                  data={mapRoleToCombobox(roles)}
                  label="Rol"
                  flexDirection="row"
                  handleSelect={(value: string) => {
                    form.setValue("roleId", value);
                    form.trigger("roleId");
                  }}
                  labelSelect="Seleccione un Rol"
                />
              </section>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2 mt-4">
              {messageGeneralError && (
                <p className="text-sm text-destructive mb-2">
                  {messageGeneralError}
                </p>
              )}
              <div className="flex justify-end gap-7">
                <ButtonCancel
                  handleCloseForm={handleCloseForm}
                  isPending={isPending}
                />
                {!(currentRow && currentRow.roleId === UserRole.GUEST) && (
                  <ButtonSave isPending={isPending} className="bg-gray-600" />
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
