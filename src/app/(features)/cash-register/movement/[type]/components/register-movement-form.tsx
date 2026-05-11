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
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";

import { DollarSign, FileText, LayoutList } from "lucide-react";

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
        className="flex flex-col gap-8"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
              <LayoutList size={14} />
              <span>Tipo de Pago</span>
            </div>
            <ComboboxForm
              data={paymentMethods.filter((method) => method.cod === PaymentMethodEnum.CASH).map((method) => ({
                label: method.name,
                value: method.cod,
              }))}
              labelSelect="Seleccione tipo"
              handleSelect={(value) => {
                form.setValue("paymentMethod", value);
                form.trigger("paymentMethod");
              }}
              control={form.control}
              name="paymentMethod"
              flexDirection="column"
              widthButton="w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-20">
              <DollarSign size={14} />
              <span>Monto:</span>
            </div>
            <div className="flex-1">
              <InputFieldForm
                control={form.control}
                name="amount"
                placeholder="0.00"
                autoFocus
                inputRef={amountRef}
                className="text-2xl font-semibold h-14"
                type="number"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
              <FileText size={14} />
              <span>Motivo o Descripción</span>
            </div>
            <InputFieldForm
              control={form.control}
              name="motive"
              placeholder="Describa el motivo del movimiento..."
            />
          </div>
        </div>

        <div className="flex flex-col pt-4">
          {messageGeneralError && (
            <p className="text-sm text-destructive mb-4 text-center font-medium bg-destructive/10 p-2 rounded-md">
              {messageGeneralError}
            </p>
          )}
          {!isLoading && (
            <ButtonSave 
              isPending={isPending} 
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            />
          )}
        </div>
      </form>
    </Form>
  );
};
