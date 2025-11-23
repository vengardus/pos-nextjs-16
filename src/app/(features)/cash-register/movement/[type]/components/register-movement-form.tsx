"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

import { RegisterMovementFormSchemaType } from "@/app/(features)/cash-register/movement/[type]/schemas/register-movement-form.schema";
import { useRegisterMovementForm } from "@/app/(features)/cash-register/movement/[type]/hooks/use-register-movement-form";
import { usePaymentMethodStore } from "@/stores/payment-method/payment-method.store";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";

interface RegisterMovementPageProps {
  movementType: string;
}
export const RegisterMovementForm = ({
  movementType,
}: RegisterMovementPageProps) => {
  const {
    form,
    handleRegisterMovementSave,
    isPending,
    isLoading,
    messageGeneralError,
    setMessageGeneralError,
  } = useRegisterMovementForm(movementType);
  const paymentMethods = usePaymentMethodStore((state) => state.paymentMethods);
  const amountRef = useRef<HTMLInputElement|null>(null);

  const handleSave = async (values: RegisterMovementFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleRegisterMovementSave(values);
    if (resp.success) postSave();
    else {
      toast.error("Error al grabar Movimiento de Caja", {
        description: resp.message,
      });
    }
  };

  const postSave = () => {
    form.reset();
    setMessageGeneralError(null);
    
    amountRef.current?.select();
  };

  useEffect(() => {
    if (amountRef.current) {
      amountRef.current.select();
    }
  }, [amountRef]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
        className="flex flex-col gap-7"
      >
        <section className="grid w-full items-center gap-4">
          <ComboboxForm
            data={paymentMethods.filter((method) => method.cod === PaymentMethodEnum.CASH).map((method) => ({
              label: method.name,
              value: method.cod,
            }))}
            labelSelect="seleccione un tipo"
            handleSelect={(value) => {
              form.setValue("paymentMethod", value);
              form.trigger("paymentMethod");
            }}
            label="Tipo"
            control={form.control}
            name="paymentMethod"
            flexDirection="column"
            widthButton="w-[300px]"
          />
          <InputFieldForm
            control={form.control}
            name="amount"
            label="Monto"
            placeholder="Ingrese monto"
            autoFocus
            inputRef={amountRef}
            className="text-right"
            type="number"
          />
          <InputFieldForm
            control={form.control}
            name="motive"
            label="Motivo"
            placeholder="Ingrese motivo"
            autoFocus
          />
        </section>
        <section className="flex flex-col items-end gap-2">
          {messageGeneralError && (
            <p className="text-sm text-destructive mb-2">
              {messageGeneralError}
            </p>
          )}
          {!isLoading && (
            <div className="flex justify-end gap-7">
              <ButtonSave isPending={isPending} />
            </div>
          )}
        </section>
      </form>
    </Form>
  );
};
