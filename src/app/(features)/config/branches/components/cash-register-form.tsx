"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
} from "@/components/ui/form";
import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";
import { CashRegisterFormSchemaType } from "@/app/(features)/config/branches/schemas/cash-register-form.schema";
import { useCashRegisterForm } from "@/app/(features)/config/branches/hooks/use-cash-register-form";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { useCashRegisterStore } from "@/stores/cash-register/cash-register.store";
import { getModelMetadata } from "@/server/common/model-metadata";

interface CashRegisterFormProps {
  currentRow: CashRegister | null;
  handleCloseForm: () => void;
}

export const CashRegisterForm = ({
  //currentRow,
  handleCloseForm,
}: CashRegisterFormProps) => {
  const selectedCashRegister = useCashRegisterStore(
    (state) => state.selectedCashRegister)
  const {
    form,
    handleSave: handleCashRegisterSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  } = useCashRegisterForm({
    currentRow: selectedCashRegister,
  });
  const cashRegisterMetadata = getModelMetadata("cashRegister");

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

  return (
    <div className="">
      <Card className="card w-full md:w-2/3">
        <CardHeader className="card-header ">
          <CardTitle>{`${!isNewRecord ? "Editar" : "Agregar"} ${
            cashRegisterMetadata.singularName
          }`}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <InputFieldForm
                  control={form.control}
                  name="description"
                  label="Nombre"
                  placeholder="Ingrese su nombre"
                  autoFocus
                  //disabled={!isNewRecord && form.getValues("isDefault")}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2 mt-3">
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
