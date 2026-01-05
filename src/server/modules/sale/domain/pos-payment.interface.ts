import type { PosPaymentDetail } from "./pos-payment-detail.interface";

export interface PosPayment {
  clientId: string;
  paymentMethodId: string;
  totalSale: number;
  totalPayment: number;
  changeDue: number;
  restAmount: number;
  cashRegisterClosureId: string;
  paymentDetails: PosPaymentDetail[];
}
