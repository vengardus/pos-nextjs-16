import { PosPaymentDetail } from "@/server/modules/sale/domain/pos-payment-detail.interface";
import type { PosPayment } from "@/server/modules/sale/domain/pos-payment.interface";
import type { SalePaymentDynamicFormSchemaType } from "@/server/modules/sale/domain/sale-payment-dynamic-form.input.schema";

export const mapSalePaymentDynamicFormSchemaTypeToPosPayment = (
  data: SalePaymentDynamicFormSchemaType
): PosPayment => {
  const posPayment: PosPayment = {
    totalSale: data.totalSale,
    cash: data.cash,
    credit: data.credit,
    card: data.card,
    paidWith: data.paidWith,
    change: data.change,
    balance: data.balance,
    paymentDetails: data.payments.map(
      (payment) => new PosPaymentDetail(payment.paymentMethodId, payment.amount)
    ),
  };

  return posPayment;
};
