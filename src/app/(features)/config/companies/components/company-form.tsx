"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Company } from "@/types/interfaces/company/company.interface";
import { CompanyBusiness } from "@/business/company.business";
import { CompanyFormSchemaType } from "@/app/(features)/config/companies/schemas/company-form.schema";
import { useCompanyForm } from "@/app/(features)/config/companies/hooks/use-company-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { InputFieldForm } from "@/components/common/form/input-field-form";

interface CompanyFormProps {
  currentCompany: Company | null;
  companyId: string;
}

export const CompanyForm = ({
  currentCompany,
  companyId,
}: CompanyFormProps) => {
  const {
    form,
    handleCompanySave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  } = useCompanyForm({
    currentCompany,
    companyId,
  });

  const handleSave = async (values: CompanyFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleCompanySave(values);
    if (resp.success) postSave();
  };

  const postSave = () => {
    form.reset();
    setMessageGeneralError(null);
  };

  return (
    <div className="">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>{`${!isNewRecord ? "Datos Generales" : "Agregar"} ${
            CompanyBusiness.metadata.singularName
          } `}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <InputFieldForm
                  control={form.control}
                  name="name"
                  type="text"
                  label="Nombre"
                  flexDirection="row"
                />

                <InputFieldForm
                  control={form.control}
                  name="taxAddress"
                  type="text"
                  label="Dirección Fiscal"
                  flexDirection="row"
                />

                <InputFieldForm
                  control={form.control}
                  name="taxGlose"
                  type="text"
                  label="Glosa Impuesto"
                  flexDirection="row"
                />

                <InputFieldForm
                  control={form.control}
                  name="taxValue"
                  type="number"
                  label="Valor Impuesto (%)"
                  flexDirection="row"
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
                            const file = e.target.files?.[0];
                            field.onChange(file ? [file] : []);
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
                <Button
                  type="button"
                  variant={"secondary"}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <ButtonSave isPending={isPending} />
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
