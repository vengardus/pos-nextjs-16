import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import type { PosPayment } from "@/types/interfaces/pos-payment/pos-payment.interface";

export class PosPaymentBusiness {
  static validateDynamic(posPayment: PosPayment): {
    success: boolean;
    message: string;
  } {
    const resp = {
      success: false,
      message: "",
    };

    if (posPayment.totalSale <= 0) {
      resp.message = "Venta debe ser mayor a 0";
      return resp;
    }

    if (posPayment.restAmount > 0) {
      resp.message = "Queda saldo por cobrar";
      return resp;
    }

    if (posPayment.restAmount < 0) {
      resp.message = "Cobro en crédito excede el total de la venta";
      return resp;
    }

    resp.success = true;
    return resp;
  }


  static calculateDynamic = (
    values: ({
      label?: string | undefined;
      value?: number | undefined;
      cod?: string | undefined;
    } | undefined)[],
    totalSale: number
  ) => {
    let totalAmount:number = 0;
    let totalNoCash:number = 0;
    let cashAmount:number = 0;

    values.forEach((field) => {
      // Convertir a number: si field.value es undefined, NaN se convierte a 0 con || 0.
      const value: number = Number(field?.value) || 0;
      if (field?.cod !== PaymentMethodEnum.CASH) {
        totalNoCash += value;
      } else {
        cashAmount += value;
      }
      totalAmount += value;
    });

    const restAmount =
      totalAmount > totalSale && totalNoCash <= totalSale
        ? 0
        : totalSale - totalAmount;
    const changeAmount = !(
      totalAmount &&
      totalNoCash < totalSale &&
      totalAmount > totalSale
    )
      ? 0
      : cashAmount - (totalSale - totalNoCash);

    return {
      totalAmount,
      restAmount,
      changeAmount,
    };

  };
}
