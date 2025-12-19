import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";

export class PaymentMethodBusiness {
  static getPaymentMethodsFromCod = (
    paymentMethods: PaymentMethod[],
    cod: string
  ): PaymentMethod | undefined => {
    return paymentMethods.find((paymentMethod) => paymentMethod.cod === cod);
  };
}
