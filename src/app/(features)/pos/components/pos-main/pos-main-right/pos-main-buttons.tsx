"use client";

import { useEffect } from "react";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";
import { PaymentMethodEnum } from "@/server/modules/payment-method/domain/payment-method.enum";
import { useCartStore } from "@/stores/cart/cart.store";
import { usePaymentMethodStore } from "@/stores/payment-method/payment-method.store";
import { ButtonIcon } from "@/components/common/buttons/button-icon";
import { useClientSupplierStore } from "@/stores/client-supplier/client-supplier.store";

//const className = `h-16 w-32 text-md font-semibold uppercase rounded-xl max-h-[3.2rem';

interface PosMainButtonsProps {
  paymentMethods: PaymentMethod[];
  clientsSuppliers: ClientSupplier[];
}
export const PosMainButtons = ({
  paymentMethods,
  clientsSuppliers,
}: PosMainButtonsProps) => {
  const setIsOpenModalSalePayment = useCartStore(
    (set) => set.setIsOpenModalSalePayment
  );
  const setPaymentMethod = useCartStore((set) => set.setPaymentMethod);
  const setPaymentMethods = usePaymentMethodStore(
    (set) => set.setPaymentMethods
  );
  const setClientSupplier = useClientSupplierStore(
    (state) => state.setClientSupplier
  );
  const setClientsSuppliers = useClientSupplierStore(
    (state) => state.setClientsSuppliers
  );
  const setClientId = useCartStore((state) => state.setClientId);
  const className = `h-16 w-32 text-md font-semibold uppercase rounded-xl ${
    paymentMethods.length > 4 ? "max-h-[3.0rem]" : "max-h-[3.2rem]"
  }`;

  useEffect(() => {
    if (paymentMethods) setPaymentMethods(paymentMethods);
    if (clientsSuppliers[0]) setClientSupplier(clientsSuppliers[0]);
    if (clientsSuppliers[0].id) setClientId(clientsSuppliers[0].id);
    if (clientsSuppliers) setClientsSuppliers(clientsSuppliers);
  }, [paymentMethods, setPaymentMethods, clientsSuppliers, setClientsSuppliers, setClientSupplier, setClientId]);

  return (
    <div className="hidden lg:grid lg:grid-cols-2 gap-3 w-full justify-items-center ">
      {paymentMethods.map((paymentMethod) => {
        return (
          <ButtonIcon
            key={paymentMethod.id}
            label={paymentMethod.name}
            className={`${className}`}
            handleClick={() => {
              console.log("paymentMethod", paymentMethod);
              setPaymentMethod(paymentMethod.cod as PaymentMethodEnum);
              setIsOpenModalSalePayment(true);
            }}
            style={{ backgroundColor: `${paymentMethod.color}` }}
          />
        );
      })}
    </div>
  );
};
