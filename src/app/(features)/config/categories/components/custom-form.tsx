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
import { Input } from "@/components/ui/input";
import type { Category } from "@/server/modules/category/domain/category.base.schema";
import { CategoryFormSchemaType } from "@/app/(features)/config/categories/schemas/category-form.schema";
import { useCategoryForm } from "@/app/(features)/config/categories/hooks/use-category-form";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";

interface CustomFormProps {
  currentRow: Category | null;
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
    handleSave: handleCategorySave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  } = useCategoryForm({
    currentCategory: currentRow,
    companyId,
  });

  const slideOver = useCustomSlideOver();

  const handleSave = async (values: CategoryFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleCategorySave(values);
    if (resp.success) postSave();
  };

  const postSave = () => {
    form.reset();
    setMessageGeneralError(null);
    if (!isNewRecord) handleCloseForm();
  };

  useEffect(() => {
    if (!slideOver) return;

    slideOver.setFooterContent(
      <div className="flex w-full justify-end gap-2">
        <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
        <ButtonSave isPending={isPending} handleOnClick={form.handleSubmit(handleSave)} />
      </div>
    );

    return () => slideOver.setFooterContent(null);
  }, [slideOver, handleCloseForm, isPending, form, handleSave]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="space-y-4">
              <InputFieldForm
                control={form.control}
                name="name"
                label="Nombre"
                placeholder="Ingrese el nombre"
                autoFocus
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
            </section>
            <section className="space-y-4">
              <FormField
                control={form.control}
                name="imageFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          field.onChange(e.target.files ?? undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>
          {messageGeneralError && (
            <p className="text-sm text-destructive">{messageGeneralError}</p>
          )}
        </div>
      </form>
    </Form>
  );
};
