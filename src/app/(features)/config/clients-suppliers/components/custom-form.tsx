"use client";

import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { AppConstants } from "@/shared/constants/app.constants";
import { ClientSupplierFormSchemaType } from "@/app/(features)/config/clients-suppliers/schemas/client-supplier-form.schema";
import { useClientSupplierForm } from "@/app/(features)/config/clients-suppliers/hooks/use-client-supplier-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";

interface CustomFormProps {
  currentRow: ClientSupplier | null;
  companyId: string;
  handleCloseForm: () => void;
}

export const CustomForm = ({
  currentRow,
  companyId,
  handleCloseForm,
}: CustomFormProps) => {
  const {
    form,
    handleSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
  } = useClientSupplierForm({
    currentRow,
    companyId,
  });

  const slideOver = useCustomSlideOver();

  const handleSubmit = async (values: ClientSupplierFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleSave(values);
    if (resp.success) postSave();
  };

  const postSave = () => {
    form.reset();
    setMessageGeneralError(null);
    handleCloseForm();
  };

  useEffect(() => {
    if (!slideOver) return;

    slideOver.setFooterContent(
      <div className="flex w-full justify-end gap-2">
        <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
        <ButtonSave isPending={isPending} handleOnClick={form.handleSubmit(handleSubmit)} />
      </div>
    );

    return () => slideOver.setFooterContent(null);
  }, [slideOver, handleCloseForm, isPending, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-5">
            <InputFieldForm
                control={form.control}
                name="name"
                label="Nombre"
                placeholder="Ingrese su nombre"
                autoFocus
            />

            <ComboboxForm
                control={form.control}
                name="personType"
                data={AppConstants.DEFAULT_VALUES.personTypes}
                label="Tipo Persona"
                flexDirection="row"
                widthButton="w-full"
                handleSelect={(value: string) => {
                    form.setValue("personType", value, { shouldValidate: true, shouldDirty: true });
                }}
                labelSelect="Seleccione tipo de persona"
            />
            
            <InputFieldForm
                control={form.control}
                name="naturalIdentifier"
                label="Documento Idenidad"
                placeholder="Ingrese documento identidad"
            />
            
            <InputFieldForm
                control={form.control}
                name="legalIdentifier"
                label="RUC"
                placeholder="Ingrese RUC"
            />

            <InputFieldForm
                control={form.control}
                name="address"
                label="Dirección"
                placeholder="Ingrese su dirección"
            />

            <InputFieldForm
                control={form.control}
                type="email"
                name="email"
                label="E-mail"
                placeholder="Ingrese su e-mail"
            />

            <InputFieldForm
                control={form.control}
                name="phone"
                type="tel"
                label="Teléfono"
                placeholder="Ingrese teléfono"
            />
            
            {messageGeneralError && (
                <p className="text-sm text-destructive">{messageGeneralError}</p>
            )}
        </div>
      </form>
    </Form>
  );
};
