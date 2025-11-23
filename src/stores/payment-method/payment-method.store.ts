import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { PaymentMethodBusiness } from "@/business/payment-method.business";

interface State {
  paymentMethod: PaymentMethod;
  paymentMethods: PaymentMethod[];
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  setPaymentMethods: (PaymentMethod: PaymentMethod[]) => void;
  getPaymentMethodFromCod: (cod: string) => PaymentMethod | undefined;
}

export const usePaymentMethodStore = create<State>()(
  persist(
    (set, get) => ({
      paymentMethod: {} as PaymentMethod,
      paymentMethods: [],

      setPaymentMethod: (paymentMethod: PaymentMethod) => {
        set({ paymentMethod });
      },

      setPaymentMethods: (paymentMethods: PaymentMethod[]) => {
        set({ paymentMethods });
      },

      getPaymentMethodFromCod: (cod: string) => {
        const paymentMethods = get().paymentMethods;
        //return paymentMethods.find((paymentMethod) => paymentMethod.cod === cod);
        return PaymentMethodBusiness.getPaymentMethodsFromCod(paymentMethods, cod);
      },
      
    }),
    {
      name: "paymentmethod-store",
    }
  )
);
