"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { Product } from "@/server/modules/product/domain/product.interface";
import type { Category } from "@/server/modules/category/domain/category.base.schema";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import { ProductFormSchemaType } from "@/app/(features)/config/products/schemas/product-form.schema";
import { useProductForm } from "@/app/(features)/config/products/hooks/use-product-form";
import { generateSKU } from "@/utils/generate/generate-sku";
import { ProductStockForm } from "./product-stock-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";
import { DialogInfo } from "@/components/common/dialog/dialog-info";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { SwitchForm } from "@/components/common/form/switch-form";
import { useCustomSlideOver } from "@/components/common/slide-over/custom-slide-over";

interface CustomFormProps {
  currentProduct: Product | null;
  companyId: string;
  handleCloseForm: () => void;
  categories: Category[];
  branches: Branch[];
}

export const CustomForm = ({
  currentProduct,
  companyId,
  handleCloseForm,
  categories,
  branches,
}: CustomFormProps) => {
  const {
    form,
    handleSave: handleProductSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
    productStocks,
    setProductStocks,
    isOpenDialogInfo,
    setIsOpenDialogInfo,
  } = useProductForm({
    currentProduct,
    companyId,
  });

  const slideOver = useCustomSlideOver();

  const handleSubmit = async (values: ProductFormSchemaType) => {
    setMessageGeneralError(null);

    let currentProductStocks = [...productStocks];

    if (isNewRecord && values.isInventoryControl) {
      const branchId = values.branchId;
      if (branchId && !currentProductStocks.some((ps) => ps.branchId === branchId)) {
        const branch = branches.find((b) => b.id === branchId);
        if (branch) {
          currentProductStocks.push({
            productId: "",
            branchId: branchId,
            branchLabel: branch.name,
            stock: values.stock ?? 0,
            minimunStock: values.minimunStock ?? 0,
          });
        }
      }

      if (!currentProductStocks.length) {
        setMessageGeneralError("Debe agregar stock en al menos una sucursal");
        return;
      }
    }

    const resp = await handleProductSave(values, currentProductStocks);
    if (resp.success) handleCloseForm();
  };

  useEffect(() => {
    if (!slideOver) return;

    slideOver.setFooterContent(
      <div className="flex w-full justify-end gap-2">
        <ButtonCancel handleCloseForm={handleCloseForm} isPending={isPending} />
        <ButtonSave isPending={isPending} handleOnClick={form.handleSubmit(handleSubmit)} />
      </div>
    );

    return () => slideOver.setFooterContent(null);
  }, [slideOver, handleCloseForm, isPending, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-5">
            <InputFieldForm
                control={form.control}
                name="name"
                label="Nombre"
                type="text"
                autoFocus
                placeholder="Ingrese el nombre"
            />
            <div className="grid grid-cols-2 gap-4">
                <InputFieldForm
                    control={form.control}
                    name="salePrice"
                    type="number"
                    label="Precio Venta"
                />
                <InputFieldForm
                    control={form.control}
                    name="purchasePrice"
                    type="number"
                    label="Precio Compra"
                />
            </div>
            <InputFieldForm
                control={form.control}
                name="barcode"
                label="Codigo de barras"
                type="text"
                placeholder="Ingrese el código de barras"
            />
            <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                <InputFieldForm
                    control={form.control}
                    name="internalCode"
                    label="Codigo interno"
                    type="text"
                    placeholder="Ingrese el código interno"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        form.setValue(
                            "internalCode",
                            generateSKU(form.getValues("name"), form.getValues("categoryId"))
                        );
                    }}
                >
                    Generar
                </Button>
            </div>
            <ComboboxForm
                control={form.control}
                name="categoryId"
                data={(categories ?? []).map((c) => ({ 
                    label: c.name, 
                    value: c.id 
                }))}
                label="Categoria"
                flexDirection="row"
                widthButton="w-full"
                handleSelect={(value: string) => {
                    form.setValue("categoryId", value, { shouldValidate: true, shouldDirty: true });
                }}
                labelSelect="Seleccione una categoria"
            />
            <SwitchForm
                control={form.control}
                name="isInventoryControl"
                label="Control de inventario"
                handleChange={() => {
                    if (!isNewRecord && !form.getValues("isInventoryControl")) setIsOpenDialogInfo(true);
                }}
            />
            {form.getValues("isInventoryControl") && (
                <ProductStockForm
                    control={form.control}
                    branches={branches}
                    productStocks={productStocks}
                    setProductStocks={setProductStocks}
                    handleSelect={(v: string) => form.setValue("branchId", v)}
                    handlePostSave={() => form.setValue("branchId", "")}
                    isNewRecord={isNewRecord}
                />
            )}
            <SwitchForm
                control={form.control}
                name="isMultiPrice"
                label="Maneja multi precios"
            />
            {messageGeneralError && <p className="text-sm text-destructive">{messageGeneralError}</p>}
        </div>
        <DialogInfo
            open={isOpenDialogInfo}
            setOpen={setIsOpenDialogInfo}
            handleAction={() => setIsOpenDialogInfo(false)}
            description="Si deshabilita el control por inventario, se eliminarán los datos de stock."
        />
      </form>
    </Form>
  );
};
