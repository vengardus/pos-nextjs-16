import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PosPaymentBusiness } from "@/server/modules/sale/utils/sale.pos-payment.business";
import {
  SalePaymentDynamicFormSchema,
  SalePaymentDynamicFormSchemaType,
} from "@/server/modules/sale/domain/sale-payment-dynamic-form.input.schema";
import { useCartProdut } from "./use-cart-product";
import { useCartStore } from "@/stores/cart/cart.store";
import { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";
import { mapSalePaymentDynamicFormSchemaTypeToPosPayment } from "@/server/modules/sale/utils/sale-pos-payment.mapper";

export const useSalePaymentDynamicForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const { saveSale } = useCartProdut();
  const clientId = useCartStore((state) => state.clientId);
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const cashRegisterOpen = useCartStore(
    (state) => state.cashRegisterOpen
  )

  const form = useForm<SalePaymentDynamicFormSchemaType>({
    resolver: zodResolver(SalePaymentDynamicFormSchema),
    defaultValues: {
      dynamicFields: [],
      clientId: "",
      cardReference: "",
      totalAmount: "0.00",
      changeAmount: "0.00",
      restAmount: "0.00",
    },
  });

  useEffect(() => {
    form.setValue("clientId", clientId);
    form.setValue("paymentMethod", paymentMethod);
    form.setValue("cardReference", "");
  }, [form, clientId, paymentMethod]);

  const handlePosPaymentSave = async (
    values: SalePaymentDynamicFormSchemaType,
    totalSale: number
  ): Promise<{ success: boolean; data:PosPayment|null, message: string }> => {
    const resp: {
      success: boolean; data:PosPayment|null, message: string
    } = {
      success: false,
      message: "",
      data: null
    };
    
    const posPayment = mapSalePaymentDynamicFormSchemaTypeToPosPayment(values); 
    posPayment.totalSale = totalSale;
    posPayment.cashRegisterClosureId = cashRegisterOpen.cashRegisterClosureId;
    const respValidate = PosPaymentBusiness.validateDynamic(posPayment);
    if (!respValidate.success) {
      resp.message = respValidate.message;
      return resp;
    }
    
    const respSave = await saveSale(setIsPending, posPayment);
    if (!respSave)  return resp;

    resp.success = true;
    resp.data = posPayment
    
    return resp;
  };

  return {
    form,
    handlePosPaymentSave,
    isPending,
    setIsPending,
    messageGeneralError,
    setMessageGeneralError,
  };
};
