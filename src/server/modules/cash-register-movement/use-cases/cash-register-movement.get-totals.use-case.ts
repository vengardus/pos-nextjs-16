import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import type {
  CashRegisterMovementTotal,
  CashRegisterMovementTotalSummary,
} from "@/types/interfaces/cash-register-movement/cash-register-movement-total-summary.interface";
import { CashRegisterMovementCategoryEnum } from "@/types/enums/cash-register-movement-category.enum";
import { CashRegisterMovementTypeEnum } from "@/types/enums/cash-register-movement-type.enum";
import { PaymentMethodEnum } from "@/types/enums/payment-method.enum";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";
import { PaymentMethodBusiness } from "@/server/modules/payment-method/utils/payment-method.business";
import { cashRegisterMovementGetTotalsRepository } from "../repository/cash-register-movement.get-totals.repository";

interface MovementTypeTotals {
  total: number;
  breakdown: Record<string, number>;
}

interface Totals {
  overall: number;
  overallCash: number;
  byPaymentMethod: Record<string, number>;
  byMovementType: Record<
    CashRegisterMovementTypeEnum,
    {
      total: number;
      breakdown: Record<string, number>;
    }
  >;
  byCashRegisterStatus: Record<CashRegisterStatusEnum, number>;
}

interface CashRegisterMovementGetTotalsUseCaseProps {
  cashRegisterClosureId: string;
  paymentMethods: PaymentMethod[];
  typeQuery: "by-cash-register-closure-id" | "by-date-range";
  startDateUTC?: Date;
  endDateUTC?: Date;
  companyId?: string;
}

export const cashRegisterMovementGetTotalsUseCase = async ({
  cashRegisterClosureId,
  paymentMethods,
  typeQuery,
  startDateUTC,
  endDateUTC,
  companyId,
}: CashRegisterMovementGetTotalsUseCaseProps): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const movements = await cashRegisterMovementGetTotalsRepository({
      cashRegisterClosureId,
      typeQuery,
      startDateUTC,
      endDateUTC,
      companyId,
    });

    const dateStart: Date = movements.length ? movements[0].date : new Date();
    const dateEnd = new Date();

    const totals: Totals = {
      overall: 0,
      overallCash: 0,
      byPaymentMethod: {} as Record<string, number>,
      byMovementType: {} as Record<
        CashRegisterMovementTypeEnum,
        {
          total: number;
          breakdown: Record<PaymentMethodEnum, number>;
        }
      >,
      byCashRegisterStatus: {} as Record<CashRegisterStatusEnum, number>,
    };

    movements.forEach((mov) => {
      if (
        mov.movementCategory === CashRegisterMovementCategoryEnum.MOVEMENT_TYPE &&
        mov.movementType === CashRegisterMovementTypeEnum.EXPENSE
      )
        totals.overall -= mov.amount;
      else totals.overall += mov.amount - mov.changeDue;

      if (mov.movementCategory === CashRegisterMovementCategoryEnum.PAYMENT_METHOD) {
        totals.byPaymentMethod[mov.paymentMethodCod] =
          (totals.byPaymentMethod[mov.paymentMethodCod] || 0) + (mov.amount - mov.changeDue);
        if (mov.paymentMethodCod === PaymentMethodEnum.CASH) {
          totals.overallCash += mov.amount - mov.changeDue;
        }
      } else if (mov.movementCategory === CashRegisterMovementCategoryEnum.MOVEMENT_TYPE) {
        const movementType = mov.movementType as CashRegisterMovementTypeEnum;
        const paymentMethod = mov.paymentMethodCod;
        if (!totals.byMovementType[movementType]) {
          totals.byMovementType[movementType] = {
            total: 0,
            breakdown: {} as Record<string, number>,
          } as MovementTypeTotals;
        }
        const amountWithSign =
          mov.movementType === CashRegisterMovementTypeEnum.INCOME ? mov.amount : -mov.amount;
        totals.byMovementType[movementType].total += amountWithSign;
        totals.byMovementType[movementType].breakdown[paymentMethod] =
          (totals.byMovementType[movementType].breakdown[paymentMethod] || 0) + amountWithSign;
        if (paymentMethod === PaymentMethodEnum.CASH) {
          totals.overallCash += amountWithSign;
        }
      } else if (mov.movementCategory === CashRegisterMovementCategoryEnum.CASH_REGISTER_STATUS) {
        totals.byCashRegisterStatus[mov.movementType as CashRegisterStatusEnum] =
          (totals.byCashRegisterStatus[mov.movementType as CashRegisterStatusEnum] || 0) +
          mov.amount;
        if (mov.paymentMethodCod === PaymentMethodEnum.CASH) {
          totals.overallCash += mov.amount;
        }
      }
    });

    totals.overall = Math.round(totals.overall * 100) / 100;
    totals.overallCash = Math.round(totals.overallCash * 100) / 100;
    Object.keys(totals.byPaymentMethod).forEach((key) => {
      totals.byPaymentMethod[key as PaymentMethodEnum] =
        Math.round(totals.byPaymentMethod[key as PaymentMethodEnum] * 100) / 100;
    });
    Object.keys(totals.byMovementType).forEach((key) => {
      const movementTypeKey = key as CashRegisterMovementTypeEnum;
      Object.keys(totals.byMovementType[movementTypeKey]).forEach((pmKey) => {
        totals.byMovementType[movementTypeKey].total =
          Math.round(totals.byMovementType[movementTypeKey].total * 100) / 100;
        totals.byMovementType[movementTypeKey].breakdown[pmKey as PaymentMethodEnum] =
          Math.round(
            totals.byMovementType[movementTypeKey].breakdown[pmKey as PaymentMethodEnum] * 100
          ) / 100;
      });
    });
    Object.keys(totals.byCashRegisterStatus).forEach((key) => {
      totals.byCashRegisterStatus[key as CashRegisterStatusEnum] =
        Math.round(totals.byCashRegisterStatus[key as CashRegisterStatusEnum] * 100) / 100;
    });

    resp.success = true;
    resp.data = formatTotals(totals, paymentMethods, dateStart, dateEnd);

    console.log("Rango:", startDateUTC, endDateUTC, "companyId:", companyId);
    console.log("query=>cashRegisterMovementGetTotals");
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};

const formatTotals = (
  totals: Totals,
  paymentMethods: PaymentMethod[],
  dateStart: Date,
  dateEnd: Date
): CashRegisterMovementTotal => {
  const summary: CashRegisterMovementTotalSummary[] = [
    {
      type: "moneyInRegister",
      label: "Fondo de caja",
      amount: totals.byCashRegisterStatus?.OPENING || 0,
      isAccumulatedTotal: true,
      code: CashRegisterStatusEnum.OPENING,
    },
    {
      type: "moneyInRegister",
      label: "Ventas en efectivo",
      amount: totals.byPaymentMethod?.CASH ?? 0,
      isAccumulatedTotal: true,
      code: PaymentMethodEnum.CASH,
    },
    {
      type: "moneyInRegister",
      label: "Ingresos varios",
      amount: totals.byMovementType?.INCOME?.total ?? 0,
      isAccumulatedTotal: true,
      code: CashRegisterMovementTypeEnum.INCOME,
    },
    {
      type: "moneyInRegister",
      label: "Egresos varios",
      amount: totals.byMovementType?.EXPENSE?.total ?? 0,
      isAccumulatedTotal: true,
      code: CashRegisterMovementTypeEnum.EXPENSE,
    },
    ...Object.keys(totals.byPaymentMethod).map(
      (key) =>
        ({
          type: "sales",
          label: `En ${PaymentMethodBusiness.getPaymentMethodsFromCod(paymentMethods, key)?.name}`,
          amount: totals.byPaymentMethod[key as PaymentMethodEnum] ?? 0,
          code: key,
          color: PaymentMethodBusiness.getPaymentMethodsFromCod(paymentMethods, key)?.color,
          isAccumulatedTotal: false,
        } as CashRegisterMovementTotalSummary)
    ),
  ];

  const totalSum = summary.reduce((acc, item) => {
    return item.type === "moneyInRegister" ? acc + item.amount : acc;
  }, 0);

  summary.push({
    type: "moneyInRegister",
    label: "Total",
    amount: Math.round(totalSum * 100) / 100,
    isAccumulatedTotal: true,
    code: "",
  });

  const salesSum = summary.reduce((acc, item) => {
    return item.type === "sales" ? acc + item.amount : acc;
  }, 0);

  summary.push({
    type: "sales",
    label: "Total",
    amount: Math.round(salesSum * 100) / 100,
    isAccumulatedTotal: true,
    code: "",
  });

  return {
    dateStart,
    dateEnd,
    summary,
  };
};
