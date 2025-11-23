"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";
import { ClientSupplierBusiness } from "@/business/client-supplier.business";
import { AppConstants } from "@/constants/app.constants";
import { ClientSupplierFormSchemaType } from "@/app/(features)/config/clients-suppliers/schemas/client-supplier-form.schema";
import { useClientSupplierForm } from "@/app/(features)/config/clients-suppliers/hooks/use-client-supplier-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { InputFieldForm } from "@/components/common/form/input-field-form";

interface ClientFormProps {
  currentClientSupplier: ClientSupplier | null;
  companyId: string;
  handleCloseForm: () => void;
}

export const ClientSupplierForm = ({
  currentClientSupplier,
  companyId,
  handleCloseForm,
}: ClientFormProps ) => {
  const {
    form,
    handleClientSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  } = useClientSupplierForm({
    currentClientSupplier,
    companyId,
  });

  const handleSave = async (values: ClientSupplierFormSchemaType) => {
    setMessageGeneralError(null);
    const resp = await handleClientSave(values);
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
            ClientSupplierBusiness.metadata.singularName
          }`}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent>
              <div className="grid grid-cols-0 md:grid-cols-2 w-full gap-3 md:gap-x-7">
                <section className="flex flex-col gap-5">
                  <InputFieldForm
                    control={form.control}
                    name="name"
                    label="Nombre"
                    placeholder="Ingrese su nombre"
                    autoFocus
                  />

                  <ComboboxForm
                    control={form.control}
                    name="personType"
                    data={AppConstants.DEFAULT_VALUES.personTypes}
                    label="Tipo Persona"
                    value={form.watch("personType")}
                    handleSelect={(value: string) => {
                      form.setValue("personType", value);
                    }}
                    labelSelect="Seleccione tipo de persona"
                  />
                  <InputFieldForm
                    control={form.control}
                    name="naturalIdentifier"
                    label="Documento Idenidad"
                    placeholder="Ingrese documento identidad"
                  />
                  <InputFieldForm
                    control={form.control}
                    name="legalIdentifier"
                    label="RUC"
                    placeholder="Ingrese RUC"
                  />
                </section>
                <section className="flex flex-col gap-5">
                  <InputFieldForm
                    control={form.control}
                    name="address"
                    label="Dirección"
                    placeholder="Ingrese su dirección"
                  />

                  <InputFieldForm
                    control={form.control}
                    type="email"
                    name="email"
                    label="E-mail"
                    placeholder="Ingrese su e-mail"
                  />

                  <InputFieldForm
                    control={form.control}
                    name="phone"
                    type="tel"
                    label="Teléfono"
                    placeholder="Ingrese teléfono"
                  />
                </section>
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
                  onClick={handleCloseForm}
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
