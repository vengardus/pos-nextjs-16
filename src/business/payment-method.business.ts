import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import  { BaseBusiness } from "./base.business";

export class PaymentMethodBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Método de pago",
    pluralName: "Métodos de pago",
  };

  static getPaymentMethodsFromCod = (
    paymentMethods: PaymentMethod[],
    cod: string
  ): PaymentMethod | undefined => {
    return paymentMethods.find((paymentMethod) => paymentMethod.cod === cod);
  };
}
