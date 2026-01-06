export interface CashRegisterMovementTotal {
  dateStart: Date;
  dateEnd: Date;
  summary: CashRegisterMovementTotalSummary[];
}
export interface CashRegisterMovementTotalSummary {
  type: "moneyInRegister" | "sales";
  label: string;
  amount: number;
  code: string;
  color?: string;
  isAccumulatedTotal: boolean
}
