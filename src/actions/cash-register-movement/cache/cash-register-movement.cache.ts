"use server";

import {
  cacheLife,
  cacheTag,
  unstable_cache as cache,
} from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cashRegisterMovementGetTotals } from "../querys/cash-register-movement.get-totals.action";

interface getCashRegisterTotalsProps {
  typeQuery: "by-cash-register-closure-id" | "by-date-range";
  cashRegisterClosureId: string;
  paymentMethods: PaymentMethod[];
  startDateUTC?: Date;
  endDateUTC?: Date;
  companyId?: string;
}
export const cashRegisterMovementGetTotalsCachedOld = async (
  props: getCashRegisterTotalsProps
): Promise<ResponseAction> => {
  "use cache";
  cacheTag(
    `cash-register-movements-totals-${
      props.cashRegisterClosureId.length ? props.cashRegisterClosureId : props.companyId
    }`
  );
  cacheLife(CacheConfig.CacheDurations);
  const { typeQuery, cashRegisterClosureId, paymentMethods, startDateUTC, endDateUTC, companyId } =
    props;

  //console.log("Rango:", startDateUTC, endDateUTC, "companyId:", props.companyId);
  console.log(
    `TAG=>cash-register-movements-totals-${
      props.cashRegisterClosureId.length ? props.cashRegisterClosureId : props.companyId
    }`
  );

  return await cashRegisterMovementGetTotals({
    typeQuery,
    cashRegisterClosureId,
    paymentMethods,
    startDateUTC,
    endDateUTC,
    companyId,
  });
};

export async function cashRegisterMovementGetTotalsCached(
  props: getCashRegisterTotalsProps
): Promise<ResponseAction> {
  // Aquí companyId está en scope, así que podemos usarlo en keyParts
  console.log("pre(props)", props);
  console.log("pre", `cash-register-movements-totals-${props.companyId}`);
  const fn = cache(
    async () => {
      const {
        typeQuery,
        cashRegisterClosureId,
        paymentMethods,
        startDateUTC,
        endDateUTC,
        companyId,
      } = props;

      return cashRegisterMovementGetTotals({
        typeQuery,
        cashRegisterClosureId,
        paymentMethods,
        startDateUTC,
        endDateUTC,
        companyId,
      });
    },
    [
      // `cash-register-movements-totals-${
      //   props.cashRegisterClosureId.length ? props.cashRegisterClosureId : props.companyId
      // }`,
      `cash-register-movements-totals-${props.companyId}`,
    ],
    { revalidate: CacheConfig.CacheDurations.revalidate }
  );
  return fn();
}
