"use client";

import { useEffect } from "react";
import { Form } from "../../../../../components/ui/form";
import { BranchFormSchemaType } from "@/app/(features)/config/branches/schemas/branch-form.schema";
import { useBranchForm } from "@/app/(features)/config/branches/hooks/use-branch-form";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { ButtonCancel } from "../../../../../components/common/buttons/button-cancel";
import { useBranchStore } from "@/stores/branch/branch.store";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";

interface BranchFormProps {
  companyId: string;
  handleCloseForm: () => void;
}

export const BranchForm = ({
  companyId,
  handleCloseForm,
}: BranchFormProps) => {
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const {
    form,
    handleSave: handleBranchSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
  } = useBranchForm({
    currentRow: selectedBranch,
    companyId,
  });
  const slideOver = useCustomSlideOver();

  const handleSave = async (values: BranchFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleBranchSave(values);
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
        <div className="grid w-full items-center gap-5">
          <InputFieldForm
            control={form.control}
            name="name"
            label="Nombre"
            placeholder="Ingrese su nombre"
            autoFocus
          />
          <InputFieldForm
            control={form.control}
            name="taxAddredss"
            label="Dirección Fiscal"
            placeholder="Ingrese dirección fiscal"
          />
        </div>
      </form>
    </Form>
  );
};
