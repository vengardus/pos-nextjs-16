import "server-only";

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { cashRegisterMovementGetTotalsUseCase } from "../../use-cases/cash-register-movement.get-totals.use-case";

interface getCashRegisterTotalsProps {
  typeQuery: "by-cash-register-closure-id" | "by-date-range";
  cashRegisterClosureId: string;
  paymentMethods: PaymentMethod[];
  startDateUTC?: Date;
  endDateUTC?: Date;
  companyId?: string;
}

export async function cashRegisterMovementGetTotalsCached(
  props: getCashRegisterTotalsProps
): Promise<ResponseAction> {
  const cacheKey =
    props.typeQuery === "by-cash-register-closure-id"
      ? `cash-register-movements-totals-${props.cashRegisterClosureId}`
      : `cash-register-movements-totals-${props.companyId}-${props.startDateUTC?.toISOString() ?? "all"}-${props.endDateUTC?.toISOString() ?? "all"}`;
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

      return cashRegisterMovementGetTotalsUseCase({
        typeQuery,
        cashRegisterClosureId,
        paymentMethods,
        startDateUTC,
        endDateUTC,
        companyId,
      });
    },
    [cacheKey],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [cacheKey, "cash-register-movements"],
    }
  );
  return fn();
}
