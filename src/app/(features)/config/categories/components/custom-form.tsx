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
import { Input } from "@/components/ui/input";
import type { Category } from "@/types/interfaces/category/category.interface";
import { CategoryBusiness } from "@/business/category.business";
import { CategoryFormSchemaType } from "@/app/(features)/config/categories/schemas/category-form.schema";
import { useCategoryForm } from "@/app/(features)/config/categories/hooks/use-category-form";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { ButtonCancel } from "../../../../../components/common/buttons/button-cancel";

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

  return (
    <div className="">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>{`${!isNewRecord ? "Editar" : "Agregar"} ${
            CategoryBusiness.metadata.singularName
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
                <FormField
                  control={form.control}
                  name="imageUrl"
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2">
              {messageGeneralError && (
                <p className="text-sm text-destructive mb-2">
                  {messageGeneralError}
                </p>
              )}
              <div className="flex justify-end gap-7">
                <ButtonCancel
                  handleCloseForm={handleCloseForm}
                  isPending={isPending}
                />
                <ButtonSave isPending={isPending} />
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
