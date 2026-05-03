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
import type { Category } from "@/server/modules/category/domain/category.base.schema";
import { CategoryFormSchemaType } from "@/app/(features)/config/categories/schemas/category-form.schema";
import { useCategoryForm } from "@/app/(features)/config/categories/hooks/use-category-form";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";
import { getModelMetadata } from "@/server/common/model-metadata";

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
  const categoryMetadata = getModelMetadata("category");

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
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{`${!isNewRecord ? "Editar" : "Agregar"} ${
          categoryMetadata.singularName
        }`}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
            <ButtonSave isPending={isPending} />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
destructive mb-2">
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
  );
};
