"use client";

import { useEffect } from "react";
import { Form } from "../../../../../components/ui/form";
import { CashRegisterFormSchemaType } from "@/app/(features)/config/branches/schemas/cash-register-form.schema";
import { useCashRegisterForm } from "@/app/(features)/config/branches/hooks/use-cash-register-form";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { ButtonCancel } from "../../../../../components/common/buttons/button-cancel";
import { useCashRegisterStore } from "@/stores/cash-register/cash-register.store";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";

interface CashRegisterFormProps {
  handleCloseForm: () => void;
}

export const CashRegisterForm = ({
  handleCloseForm,
}: CashRegisterFormProps) => {
  const selectedCashRegister = useCashRegisterStore(
    (state) => state.selectedCashRegister);
  const {
    form,
    handleSave: handleCashRegisterSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
  } = useCashRegisterForm({
    currentRow: selectedCashRegister,
  });
  const slideOver = useCustomSlideOver();

  const handleSave = async (values: CashRegisterFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleCashRegisterSave(values);
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
        <div className="grid w-full items-center gap-4">
          <InputFieldForm
            control={form.control}
            name="description"
            label="Nombre"
            placeholder="Ingrese su nombre"
            autoFocus
          />
        </div>
      </form>
    </Form>
  );
};
