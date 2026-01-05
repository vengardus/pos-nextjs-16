import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { PosPaymentDetail } from "@/server/modules/sale/domain/pos-payment-detail.interface";
import type { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";
import { SalePaymentDynamicFormSchemaType } from "@/server/modules/sale/domain/sale-payment-dynamic-form.input.schema";


export const mapSalePaymentDynamicFormSchemaTypeToPosPayment = (
  formShenaType: SalePaymentDynamicFormSchemaType
): PosPayment => {
  return {
    clientId: formShenaType.clientId,
    paymentMethodId: formShenaType.paymentMethod,
    totalSale: 0,
    totalPayment: Number(formShenaType.totalAmount),
    changeDue: Number(formShenaType.changeAmount),
    restAmount: Number(formShenaType.restAmount),
    cashRegisterClosureId: "",
    paymentDetails: formShenaType.dynamicFields.filter((field) => field.value > 0).map((field) => {
      const detail: PosPaymentDetail = {
        paymentMethodId: field.id,
        paymentMethodCod: field.cod,
        amount: field.value,
        description: formShenaType.cardReference,
        changeDue: field.cod === PaymentMethodEnum.CASH ? Number(formShenaType.changeAmount) : 0,
      };
      return detail;
    }),
  };
}