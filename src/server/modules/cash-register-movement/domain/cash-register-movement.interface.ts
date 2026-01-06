export interface CashRegisterMovement {
  id?: string;
  date?: Date;
  amount: number;
  description: string;
  movementCategory: string;
  movementType: string;
  paymentMethodCod: string;
  changeDue: number;
  paymentMethodId: string;
  userId: string;
  cashRegisterClosureId: string;
}
