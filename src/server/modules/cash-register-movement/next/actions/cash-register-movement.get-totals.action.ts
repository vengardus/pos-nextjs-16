"use server";

import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { cashRegisterMovementGetTotalsCached } from "@/server/modules/cash-register-movement/next/cache/cash-register-movement.get-totals.cache";

interface getCashRegisterTotalsProps {
  typeQuery: "by-cash-register-closure-id" | "by-date-range";
  cashRegisterClosureId: string;
  paymentMethods: PaymentMethod[];
  startDateUTC?: Date;
  endDateUTC?: Date;
  companyId?: string;
}

export const cashRegisterMovementGetTotalsAction = async (
  props: getCashRegisterTotalsProps
): Promise<ResponseAction> => {
  const { typeQuery, cashRegisterClosureId, paymentMethods, startDateUTC, endDateUTC, companyId } =
    props;

  return await cashRegisterMovementGetTotalsCached({
    typeQuery,
    cashRegisterClosureId,
    paymentMethods,
    startDateUTC,
    endDateUTC,
    companyId,
  });
};
