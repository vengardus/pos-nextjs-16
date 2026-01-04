import "server-only";

import { unstable_cache as cache } from "next/cache";

import { CacheConfig } from "@/server/next/cache.config";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
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
    [`cash-register-movements-totals-${props.companyId}`],
    {
      revalidate: CacheConfig.CacheDurations.revalidate,
      tags: [
        `cash-register-movements-totals-${props.companyId}`,
        "cash-register-movements",
      ],
    }
  );
  return fn();
}
