"use client";

import { useRef } from "react";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/types/interfaces/product/product.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { ProductFormSchemaType } from "@/app/(features)/config/products/schemas/product-form.schema";
import { ProductBusiness } from "@/business/product.business";
import { useProductForm } from "@/app/(features)/config/products/hooks/use-product-form";
import { useMediaQuery } from "@/hooks/media-query/use-media-query";
import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";
import { generateSKU } from "@/utils/generate/generate-sku";
import { ProductStockForm } from "./product-stock-form";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";
import { DialogInfo } from "@/components/common/dialog/dialog-info";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { SwitchForm } from "@/components/common/form/switch-form";

interface CustomFormProps {
  currentProduct: Product | null;
  companyId: string;
  handleCloseForm: () => void;
  data: {
    categories: Category[];
    branches: Branch[];
  };
}

export const CustomForm = ({
  currentProduct,
  companyId,
  handleCloseForm,
  data,
}: CustomFormProps) => {
  const { categories, branches } = data;
  const screenSize = useMediaQuery();
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
  const salePriceRef = useRef<HTMLInputElement>(null);
  const purchasePriceRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (values: ProductFormSchemaType) => {
    setMessageGeneralError(null);
    if (
      isNewRecord &&
      form.getValues("isInventoryControl") &&
      !productStocks.length
    ) {
      setMessageGeneralError("Debe agregar stock en al menos una sucursal");
      return;
    }
    const resp = await handleProductSave(values, productStocks);
    if (resp.success) postSave();
  };

  const handleError = (error: unknown) => {
    setMessageGeneralError("Ocurrió un error, revise los datos.");
    console.log(error); // usada intencionalmente
  };

  const postSave = () => {
    form.reset();
    setProductStocks([]);
    setMessageGeneralError(null);
    if (!isNewRecord) handleCloseForm();
  };

  return (
    <div className="">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>{`${!isNewRecord ? "Editar" : "Agregar"} ${
            ProductBusiness.metadata.singularName
          }`}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, handleError)}>
            <CardContent>
              <div className="grid w-full gap-y-5 md:grid-cols-2 md:items-start md:gap-x-7">
                <section className="grid gap-5">
                  <InputFieldForm
                    control={form.control}
                    name="name"
                    label="Nombre"
                    type="text"
                    autoFocus
                    flexDirection="column"
                    placeholder="Ingrese el nombre"
                  />

                  <InputFieldForm
                    control={form.control}
                    name="salePrice"
                    type="number"
                    label="Precio Venta"
                    flexDirection="row"
                    inputRef={salePriceRef}
                  />

                  <InputFieldForm
                    control={form.control}
                    name="purchasePrice"
                    type="number"
                    label="Precio Compra"
                    flexDirection="row"
                    inputRef={purchasePriceRef}
                  />

                  <InputFieldForm
                    control={form.control}
                    name="barcode"
                    label="Codigo de barras"
                    type="text"
                    flexDirection="column"
                    placeholder="Ingrese el código de barras"
                  />

                  <article className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                    <InputFieldForm
                      control={form.control}
                      name="internalCode"
                      label="Codigo interno"
                      type="text"
                      flexDirection="column"
                      placeholder="Ingrese el código interno"
                      className=" "
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.setValue(
                          "internalCode",
                          generateSKU(
                            form.getValues("name"),
                            form.getValues("categoryId")
                          )
                        );
                      }}
                    >
                      {screenSize < ScreenSizeEnum.lg
                        ? "Generar Código Interno ..."
                        : "Generar"}
                    </Button>
                  </article>
                </section>

                <section className="grid gap-7 h-full">
                  <section>
                    <ComboboxForm
                      control={form.control}
                      name="categoryId"
                      data={categories.map((category) => ({
                        label: category.name,
                        value: category.id,
                      }))}
                      label="Categoria"
                      flexDirection="row"
                      handleSelect={(value: string) => {
                        form.setValue("categoryId", value);
                        form.trigger("categoryId");
                      }}
                      labelSelect="Seleccione una categoria"
                    />

                    <SwitchForm
                      control={form.control}
                      name="isInventoryControl"
                      label="Control de inventario"
                      flexDirection="row"
                      handleChange={() => {
                        if (
                          !isNewRecord &&
                          !form.getValues("isInventoryControl")
                        ) {
                          setIsOpenDialogInfo(true);
                        } else if (!form.getValues("isInventoryControl")) {
                          setMessageGeneralError(null);
                        }
                      }}
                    />

                    {form.getValues("isInventoryControl") && (
                      <ProductStockForm
                        control={form.control}
                        branches={branches}
                        productStocks={productStocks}
                        setProductStocks={(value) => setProductStocks(value)}
                        handleSelect={(value: string) => {
                          form.setValue("branchId", value);
                        }}
                        handlePostSave={() => {
                          form.setValue("branchId", "");
                        }}
                        isNewRecord={isNewRecord}
                      />
                    )}

                    <SwitchForm
                      control={form.control}
                      name="isMultiPrice"
                      label="Maneja multi precios"
                      flexDirection="row"
                    />
                  </section>

                  <section className="flex justify-end gap-7 items-end">
                    <ButtonCancel
                      handleCloseForm={handleCloseForm}
                      isPending={isPending}
                    />
                    <ButtonSave isPending={isPending} />
                  </section>
                </section>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2">
              {messageGeneralError && (
                <p className="text-sm text-destructive mb-2">
                  {messageGeneralError}
                </p>
              )}
            </CardFooter>
          </form>
        </Form>

        <DialogInfo
          open={isOpenDialogInfo}
          setOpen={setIsOpenDialogInfo}
          handleAction={() => setIsOpenDialogInfo(false)}
          description={`Producto tiene datos de stock de sucursales. Si deshabilita el control por inventario,
          al grabar el producto se eliminarán los datos de stock en el almacén.`}
        />
      </Card>
    </div>
  );
};
