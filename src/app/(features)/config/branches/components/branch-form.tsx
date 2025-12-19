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
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { BranchFormSchemaType } from "@/app/(features)/config/branches/schemas/branch-form.schema";
import { useBranchForm } from "@/app/(features)/config/branches/hooks/use-branch-form";
import { InputFieldForm } from "../../../../../components/common/form/input-field-form";
import { ButtonSave } from "../../../../../components/common/buttons/button-save";
import { useBranchStore } from "@/stores/branch/branch.store";
import { useEffect } from "react";
import { getModelMetadata } from "@/server/common/model-metadata";

interface BranchFormProps {
  currentRow: Branch | null;
  companyId: string;
  handleCloseForm: () => void;
}

export const BranchForm = ({
  //currentRow,
  companyId,
  handleCloseForm,
}: BranchFormProps) => {
  const selectedBranch = useBranchStore((state)=> state.selectedBranch)
  const {
    form,
    handleSave: handleBranchSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  } = useBranchForm({
    currentRow:selectedBranch,
    companyId,
  });
  const branchMetadata = getModelMetadata("branch");

  useEffect(()=>{
    console.log("SELECTED_BRANCH")
  }, [selectedBranch])

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

  return (
    <div className="">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>{`${!isNewRecord ? "Editar" : "Agregar"} ${
            branchMetadata.singularName
          }`}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent>
              <div className="grid w-full items-center gap-5">
                <InputFieldForm
                  control={form.control}
                  name="name"
                  label="Nombre"
                  placeholder="Ingrese su nombre"
                  autoFocus
                  //disabled={!isNewRecord && form.getValues("isDefault")}
                />
                <InputFieldForm
                  control={form.control}
                  name="taxAddredss"
                  label="Dirección Fiscal"
                  placeholder="Ingrese dirección fiscal"
                  //disabled={!isNewRecord && form.getValues("isDefault")}
                />
                
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2 mt-4">
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
