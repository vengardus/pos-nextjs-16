"use client";

import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Form } from "../../../../../components/ui/form";

import type { UserDataBaseCustomForm } from "@/app/(features)/config/roles/types/user-data-base-custom-form.interface";
import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonCancel } from "../../../../../components/common/buttons/button-cancel";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";

import type { Role } from "@/types/interfaces/role/role.interface";
import { useRoleForm } from "@/app/(features)/config/roles/hooks/use-role-form";
import { PermissionManager } from "./permission-manager";

interface CustomFormProps<Model extends Role, FormDataShape extends UserDataBaseCustomForm> {
  currentRow: Model | null;
  handleCloseForm: () => void;
  handleUpdateOptimistic: (currentRow: Model) => void;
  metadata: ModelMetadata;
  data: FormDataShape;
}

export const CustomForm = <Model extends Role, FormDataShape extends UserDataBaseCustomForm>({
  currentRow,
  handleCloseForm,
  handleUpdateOptimistic,
  metadata,
  data,
}: CustomFormProps<Model, FormDataShape>) => {
  const {
    form,
    handleSave: handleUserSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
    modules,
    permissions,
    isLoading,
  } = useRoleForm({
    currentRow,
    companyId: data.companyId,
  });
  const descriptionValue = form.watch("description");

  useEffect(() => {
    if (isNewRecord && descriptionValue) {
      form.setValue("cod", descriptionValue.toUpperCase().replaceAll(" ", "-"), { shouldValidate: true });
      form.trigger("cod");
    }
  }, [descriptionValue, form, isNewRecord]);

  const handleSave = async (values: any) => {
    setMessageGeneralError(null);
    const resp = await handleUserSave(values as Role);
    if (!resp.success) {
      setMessageGeneralError(resp.message ?? "");
      return;
    }
    postSave(resp.data!);
  };

  const postSave = (currentRow: Model) => {
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
          <CardTitle>
            {`${!isNewRecord ? "Editar" : "Agregar"} ${metadata.singularName}`}
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent className="grid w-full gap-10 lg:grid-cols-2">
              <section className="flex flex-col gap-4">
                <InputFieldForm
                  control={form.control}
                  name="description"
                  label="Descripción"
                  placeholder="Ingrese descripción Role"
                  autoFocus
                  disabled={!isNewRecord && form.getValues("isDefault")}
                />
                <InputFieldForm
                  control={form.control}
                  name="cod"
                  label="Código"
                  placeholder="Ingrese código Role"
                  onChange={(event) => {
                    const value = event.target.value.toUpperCase(); // Obtiene el valor actualizado
                    form.setValue("cod", value, { shouldValidate: true }); // Actualiza y valida el campo
                  }}
                  disabled={!isNewRecord && form.getValues("isDefault")}
                />
              </section>
              {isLoading ? (
                <div>Cargando permisos...</div>
              ) : (
                <section className="h-full flex flex-col gap-2">
                  <PermissionManager
                    modules={modules}
                    permissions={permissions}
                    roleCod={currentRow ? currentRow.cod : ""}
                  />
                </section>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2">
              {messageGeneralError && (
                <p className="text-sm text-destructive mb-2 text-start w-full">{messageGeneralError}</p>
              )}
              <div className="flex justify-end gap-7">
                <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
                <ButtonSave isPending={isPending} />
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
