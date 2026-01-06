import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";
import type { PosPaymentDetail } from "@/server/modules/sale/domain/pos-payment-detail.interface";
import type { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";
import type { SalePaymentDynamicFormSchemaType } from "@/server/modules/sale/domain/sale-payment-dynamic-form.input.schema";

export const mapSalePaymentDynamicFormSchemaTypeToPosPayment = (
  formSchemaType: SalePaymentDynamicFormSchemaType
): PosPayment => {
  return {
    clientId: formSchemaType.clientId,
    paymentMethodId: formSchemaType.paymentMethod,
    totalSale: 0,
    totalPayment: Number(formSchemaType.totalAmount),
    changeDue: Number(formSchemaType.changeAmount),
    restAmount: Number(formSchemaType.restAmount),
    cashRegisterClosureId: "",
    paymentDetails: formSchemaType.dynamicFields
      .filter((field) => field.value > 0)
      .map((field) => {
        const detail: PosPaymentDetail = {
          paymentMethodId: field.id,
          paymentMethodCod: field.cod,
          amount: field.value,
          description: formSchemaType.cardReference,
          changeDue:
            field.cod === PaymentMethodEnum.CASH
              ? Number(formSchemaType.changeAmount)
              : 0,
        };
        return detail;
      }),
  };
};
