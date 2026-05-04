"use client";

import { useEffect } from "react";
import { CirclePicker } from "react-color";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import { PaymentMethodFormSchemaType } from "@/app/(features)/config/payment-methods/schemas/payment-method-form.schema";
import { usePaymentMethodForm } from "@/app/(features)/config/payment-methods/hooks/use-payment-method-form";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { ButtonCancel } from "../../../../../components/common/buttons/button-cancel";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";

interface CustomFormProps {
  currentRow: PaymentMethod | null;
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
    handleSave: handlePaymentMethodSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  } = usePaymentMethodForm({
    currentRow,
    companyId,
  });

  const slideOver = useCustomSlideOver();

  useEffect(() => {
    slideOver?.setFooterContent(
      <>
        <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
        <ButtonSave isPending={isPending} type="submit" form="payment-method-form" />
      </>
    );
  }, [isPending]);

  const handleSave = async (values: PaymentMethodFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handlePaymentMethodSave(values);
    if (resp.success) postSave();
  };

  const postSave = () => {
    form.reset();
    setMessageGeneralError(null);
    if (!isNewRecord) handleCloseForm();
  };

  return (
    <Form {...form}>
      <form id="payment-method-form" onSubmit={form.handleSubmit(handleSave)}>
        <div className="grid w-full items-center gap-4 py-2">
          <InputFieldForm
            control={form.control}
            name="name"
            label="Nombre"
            placeholder="Ingrese su nombre"
            autoFocus
            disabled={!isNewRecord && form.getValues("isDefault")}
          />
          <InputFieldForm
            control={form.control}
            name="cod"
            label="Código"
            placeholder="Ingrese código único"
            onChange={(event) => {
              const value = event.target.value.toUpperCase();
              form.setValue("cod", value, { shouldValidate: true });
            }}
            disabled={!isNewRecord && form.getValues("isDefault")}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <CirclePicker
                    color={field.value}
                    onChange={(color) => {
                      field.onChange(color.hex);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {messageGeneralError && (
            <p className="text-sm text-destructive">{messageGeneralError}</p>
          )}
        </div>
      </form>
    </Form>
  );
};
