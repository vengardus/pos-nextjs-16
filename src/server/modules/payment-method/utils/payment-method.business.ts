import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";

export class PaymentMethodBusiness {
  static getPaymentMethodsFromCod = (
    paymentMethods: PaymentMethod[],
    cod: string
  ): PaymentMethod | undefined => {
    return paymentMethods.find((paymentMethod) => paymentMethod.cod === cod);
  };
}
