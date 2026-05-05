"use client";

import { useEffect } from "react";
import { Form } from "../../../../../components/ui/form";

import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonCancel } from "../../../../../components/common/buttons/button-cancel";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";

import type { Role } from "@/server/modules/role/domain/role.interface";
import { useRoleForm } from "@/app/(features)/config/roles/hooks/use-role-form";
import { PermissionManager } from "./permission-manager";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import type { Module } from "@/server/modules/permission/domain/module.interface";

interface CustomFormProps {
  currentRow: Role | null;
  handleCloseForm: () => void;
  companyId: string;
  modules: Module[];
}

export const CustomForm = ({
  currentRow,
  handleCloseForm,
  companyId,
  modules,
}: CustomFormProps) => {
  const {
    form,
    handleSave: handleUserSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
    permissions,
    isLoading,
  } = useRoleForm({
    currentRow,
    companyId: companyId,
  });
  const descriptionValue = form.watch("description");
  const slideOver = useCustomSlideOver();

  useEffect(() => {
    if (isNewRecord && descriptionValue) {
      form.setValue("cod", descriptionValue.toUpperCase().replaceAll(" ", "-"), { shouldValidate: true });
      form.trigger("cod");
    }
  }, [descriptionValue, form, isNewRecord]);

  const handleSave = async (values: any) => {
    setMessageGeneralError(null);
    const resp = await handleUserSave(values as Role);
    if (resp.success) {
      postSave();
    }
  };

  const postSave = () => {
    form.reset();
    setMessageGeneralError(null);
    if (!isNewRecord) {
      handleCloseForm();
    }
  };

  useEffect(() => {
    if (!slideOver) return;

    slideOver.setFooterContent(
      <div className="flex w-full flex-col items-end gap-2">
        {messageGeneralError && (
          <p className="text-sm text-destructive">{messageGeneralError}</p>
        )}
        <div className="flex justify-end gap-7">
          <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
          <ButtonSave isPending={isPending} handleOnClick={form.handleSubmit(handleSave)} />
        </div>
      </div>
    );

    return () => slideOver.setFooterContent(null);
  }, [slideOver, handleCloseForm, isPending, form, handleSave, messageGeneralError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <div className="grid w-full gap-10 lg:grid-cols-1">
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
            <div className="flex justify-center p-4">Cargando permisos...</div>
          ) : (
            <section className="h-full flex flex-col gap-2">
              <PermissionManager
                modules={modules}
                permissions={permissions}
                roleCod={currentRow ? currentRow.cod : ""}
              />
            </section>
          )}
        </div>
      </form>
    </Form>
  );
};
