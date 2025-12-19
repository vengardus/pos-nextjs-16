"use client";

import { CirclePicker } from "react-color";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { PaymentMethodFormSchemaType } from "@/app/(features)/config/payment-methods/schemas/payment-method-form.schema";
import { usePaymentMethodForm } from "@/app/(features)/config/payment-methods/hooks/use-payment-method-form";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { ButtonCancel } from "../../../../../components/common/buttons/button-cancel";
import { getModelMetadata } from "@/server/common/model-metadata";

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
  const paymentMethodMetadata = getModelMetadata("paymentMethod");

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
    <div className="">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>{`${!isNewRecord ? "Editar" : "Agregar"} ${
            paymentMethodMetadata.singularName
          }`}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
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
                    const value = event.target.value.toUpperCase(); // Obtiene el valor actualizado
                    form.setValue("cod", value, { shouldValidate: true }); // Actualiza y valida el campo
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2">
              {messageGeneralError && (
                <p className="text-sm text-destructive mb-2">
                  {messageGeneralError}
                </p>
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
