"use cache";

import 'server-only'

import { cacheLife, cacheTag } from "next/cache";

import { CacheConfig } from "@/config/cache.config";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cashRegisterMovementGetTotals } from "./cash-register-movement.get-totals";

interface getCashRegisterTotalsProps {
  typeQuery: "by-cash-register-closure-id" | "by-date-range";
  cashRegisterClosureId: string;
  paymentMethods: PaymentMethod[];
  startDateUTC?: Date;
  endDateUTC?: Date;
  companyId?: string;
}
export const cashRegisterMovementGetTotalsCached = async (
  props: getCashRegisterTotalsProps
): Promise<ResponseAction> => {
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

// export async function cashRegisterMovementGetTotalsCached(
//   props: getCashRegisterTotalsProps
// ): Promise<ResponseAction> {
//   // Aquí companyId está en scope, así que podemos usarlo en keyParts
//   console.log("pre(props)", props);
//   console.log("pre", `cash-register-movements-totals-${props.companyId}`);
//   const fn = cache(
//     async () => {
//       const {
//         typeQuery,
//         cashRegisterClosureId,
//         paymentMethods,
//         startDateUTC,
//         endDateUTC,
//         companyId,
//       } = props;
//
//       return cashRegisterMovementGetTotals({
//         typeQuery,
//         cashRegisterClosureId,
//         paymentMethods,
//         startDateUTC,
//         endDateUTC,
//         companyId,
//       });
//     },
//     [
//       // `cash-register-movements-totals-${
//       //   props.cashRegisterClosureId.length ? props.cashRegisterClosureId : props.companyId
//       // }`,
//       `cash-register-movements-totals-${props.companyId}`,
//     ],
//     { revalidate: CacheConfig.CacheDurations.revalidate }
//   );
//   return fn();
// }
