"use client";

import { useEffect, useRef } from "react";
import { useFieldArray } from "react-hook-form";

interface SalePaymentDynamicFormProps {
  handleCloseForm: () => void;
}

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Asegúrate de ajustar la ruta según tu proyecto
import { Input } from "@/components/ui/input";
import { usePaymentMethodStore } from "@/stores/payment-method/payment-method.store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/stores/cart/cart.store";
import { SalePaymentDynamicFormSchemaType } from "@/server/modules/sale/domain/sale-payment-dynamic-form.input.schema";
import { useSalePaymentDynamicForm } from "@/app/(features)/pos/hooks/use-sale-payment-dynamic-form";
import { useCartProdut } from "@/app/(features)/pos/hooks/use-cart-product";
import { toast } from "sonner";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { useClientSupplierStore } from "@/stores/client-supplier/client-supplier.store";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";
import { PosPaymentBusiness } from "@/server/modules/sale/utils/sale.pos-payment.business";
import { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { ButtonCancel } from "@/components/common/buttons/button-cancel";

export default function SalePaymentDynamicForm({
  handleCloseForm,
}: SalePaymentDynamicFormProps) {
  // Inicializamos React Hook Form usando el zodResolver.
  const appendedRef = useRef(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const getSummaryCart = useCartStore((state) => state.getSummaryCart);
  const totalSale = getSummaryCart().total;
  const {
    form,
    handlePosPaymentSave,
    isPending,
    setIsPending,
    messageGeneralError,
    setMessageGeneralError,
  } = useSalePaymentDynamicForm();
  const { handleGenerateTicketSale } = useCartProdut();
  const setIsOpenTicketModal = useCartStore(
    (state) => state.setIsOpenTicketModal
  );
  const clearCart = useCartStore((state) => state.clearCart);
  const clientsSuppliers = useClientSupplierStore(
    (state) => state.clientsSuppliers
  );
  const paymentMethods = usePaymentMethodStore((state) => state.paymentMethods);
  const { control, handleSubmit } = form;
  const formId = "sale-payment-dynamic-form";
  // useFieldArray para manejar el array de campos dinámicos.
  const { fields, append } = useFieldArray({
    control,
    name: "dynamicFields",
  });
  const dynamicFieldMappingRef = useRef<{ [cod: string]: number }>({});
  const paymentMethod = form.watch("paymentMethod");

  const handleSave = async (values: SalePaymentDynamicFormSchemaType) => {
    setMessageGeneralError(null);
    setIsPending(true);
    const resp = await handlePosPaymentSave(values, totalSale);
    if (!resp.success) {
      if (resp.message.length) toast.error(resp.message);
      setIsPending(false);
      return;
    }
    postSave(resp.data!);
  };

  const postSave = async (posPayment: PosPayment) => {
    form.reset();
    setMessageGeneralError(null);
    handleCloseForm();
    await handleGenerateTicketSale("b64", posPayment);
    clearCart();
    setIsOpenTicketModal(true);
    setIsPending(false);
  };

  useEffect(() => {
    // agrega los campos dinámicos
    if (
      !appendedRef.current &&
      fields.length === 0 &&
      paymentMethods.length > 0
    ) {
      console.log("paymentMethods!!!", paymentMethods);
      paymentMethods
        .filter(
          (paymentMethod) => paymentMethod.cod !== PaymentMethodEnum.MIXED
        )
        .forEach((paymentMethod, idx) => {
          append({
            label: paymentMethod.name,
            value: 0,
            cod: paymentMethod.cod,
            id: paymentMethod.id,
          });
          dynamicFieldMappingRef.current[paymentMethod.cod] = idx;
        });

      appendedRef.current = true;
    }
  }, [paymentMethods, append, fields, form]);

  useEffect(() => {
    console.log("fields", fields);
    console.log("dynamicFieldMappingRef.current", dynamicFieldMappingRef);
  }, [fields, dynamicFieldMappingRef]);

  useEffect(() => {
    // setea los inputs de los montos y hace el focus
    const setFormValue = (cod: string, value: any) => {
      const index = dynamicFieldMappingRef.current[cod];
      if (index !== undefined) {
        form.setValue(`dynamicFields.${index}.value`, value);
        form.trigger(`dynamicFields.${index}.value`);
      }
    };

    const setFocus = (cod: string) => {
      const input = inputRefs.current[cod];
      if (input) input.select();
    };

    switch (paymentMethod) {
      case PaymentMethodEnum.MIXED:
        //setFormValue("cashAmount", totalSale);
        setFocus(PaymentMethodEnum.CASH);
        break;

      default:
        Object.entries(dynamicFieldMappingRef.current).forEach(([cod]) => {
          if (cod !== paymentMethod) {
            setFormValue(cod, "0");
          }
        });
        setFormValue(paymentMethod, totalSale.toFixed(2));
        setFocus(paymentMethod);
        break;
    }
  }, [paymentMethod, form, totalSale]);

  useEffect(() => {
    // calcula los montos (totalAmount, restAmount, changeAmount)
    const subscription = form.watch((values, { name }) => {
      if (name && name.startsWith("dynamicFields")) {
        if (values.dynamicFields) {
          const calculate = PosPaymentBusiness.calculateDynamic(
            values.dynamicFields,
            totalSale
          );
          console.log("calculate", calculate);
          form.setValue("totalAmount", calculate.totalAmount.toFixed(2));
          form.setValue("restAmount", calculate.restAmount.toFixed(2));
          form.setValue("changeAmount", calculate.changeAmount.toFixed(2));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, totalSale]);

  return (
    <div>
      <Card className="card">
        <Form {...form}>
          <form id={formId} onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <CardHeader className="flex flex-col items-center justify-center gap-3 border-b bg-gray-800 p-3 md:p-4 space-y-0">
              <div className="flex items-baseline gap-2 text-center">
                <CardTitle className="text-lg md:text-xl">
                  COBRAR:
                </CardTitle>
                <p className="text-2xl font-black text-foreground">
                  S/. {totalSale.toFixed(2)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-3 pt-0 md:p-4 md:pt-0">
              <section className="border p-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <ComboboxForm
                  data={clientsSuppliers.map(
                    (clientSupplier: ClientSupplier) => ({
                      label: clientSupplier.name,
                      value: clientSupplier.id,
                    })
                  )}
                  labelSelect="Seleccione cliente"
                  handleSelect={(value) => {
                    form.setValue("clientId", value);
                    form.trigger("clientId");
                  }}
                  label="Cliente"
                  control={form.control}
                  name="clientId"
                  flexDirection="column"
                  widthButton="w-[300px]"
                />
                <ComboboxForm
                  data={paymentMethods.map((method) => ({
                    label: method.name,
                    value: method.cod,
                  }))}
                  labelSelect="Tipo de cobranza"
                  handleSelect={(value) => {
                    form.setValue("paymentMethod", value);
                    form.trigger("paymentMethod");
                  }}
                  label="Tipo Cobro"
                  control={form.control}
                  name="paymentMethod"
                  flexDirection="column"
                  widthButton="w-[300px]"
                  isImportant={true}
                />
              </section>
              <section className="border p-2">
                {fields
                  .filter((field) => field.cod != PaymentMethodEnum.MIXED)
                  .map((fieldItem, index) => (
                    <FormField
                      key={fieldItem.id}
                      control={control}
                      name={`dynamicFields.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-2 items-center">
                          <FormLabel>{fieldItem.label}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Monto"
                              {...field}
                              className="text-right text-foreground"
                              ref={(node) => {
                                inputRefs.current[fieldItem.cod] = node;
                                // También propaga la ref original si es necesario
                                field.ref(node);
                              }}
                              disabled={
                                ![fieldItem.cod, PaymentMethodEnum.MIXED].some(
                                  (value) =>
                                    value === form.getValues("paymentMethod")
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
              </section>

              <section className="grid grid-cols-2 gap-3">
                <section className="border p-2">
                  <InputFieldForm
                    control={form.control}
                    name="cardReference"
                    label="Referencia Tarjeta"
                    placeholder="Ingrese referencia de tarjeta"
                    flexDirection="column"
                    disabled={
                      ![
                        PaymentMethodEnum.CREDIT_CARD,
                        PaymentMethodEnum.MIXED,
                      ].some((value) => value === form.getValues("paymentMethod"))
                    }
                  />
                </section>

                <section className="border p-1">
                  <InputFieldForm
                    control={form.control}
                    name="totalAmount"
                    label="Total"
                    flexDirection="row"
                    type="number"
                    className="text-right disabled:opacity-100 disabled:text-lg disabled:text-foreground"
                    disabled
                  />
                  <InputFieldForm
                    control={form.control}
                    name="restAmount"
                    label="Restante"
                    flexDirection="row"
                    type="number"
                    className="text-right disabled:opacity-100 disabled:text-lg disabled:text-foreground"
                    disabled
                  />
                  <InputFieldForm
                    control={form.control}
                    name="changeAmount"
                    label="Vuelto"
                    flexDirection="row"
                    type="number"
                    className="text-right disabled:opacity-100 disabled:text-lg disabled:text-foreground"
                    disabled
                  />
                </section>
              </section>
            </CardContent>
            <CardFooter className="flex justify-end p-3 md:p-4 pt-0">
              <div className="flex flex-col gap-3 items-end w-full">
                  <div className="w-full flex flex-col-reverse items-stretch gap-3 sm:flex-row md:justify-end">
                    <ButtonCancel
                      handleCloseForm={handleCloseForm}
                      isPending={isPending}
                    />
                    <ButtonSave
                      isPending={isPending}
                      label="Grabar"
                      pendingLabel="Guardando..."
                      form={formId}
                    />
                  </div>
                  {messageGeneralError && (
                    <p className="text-sm text-destructive text-right">
                      {messageGeneralError}
                    </p>
                  )}
                </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
