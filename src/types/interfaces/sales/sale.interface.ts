import type { CashRegisterMovement } from "../cash-register-movement/cash-register-movement.interface";
import type { SaleDetail } from "./sale-detail.interface";

export interface Sale {
    id: string;
    totalAmount: number;
    paymentType: string;
    status: string;
    totalTaxes: number;
    balance: number;
    paidWith: number;
    cardReference: string;
    change: number;
    cash: number;
    credit: number;
    card: number;
    productCount: number;
    subTotal: number;
  
    // relations
    userId: string;
    branchId: string;
    companyId: string;
    clientId: string;
    //User: User;
    //Branch: Branch;
    //Company: Company;
    //Client: Client;
    SaleDetail: SaleDetail[];
    CashRegisterMovement?: CashRegisterMovement[];
  
    createdAt?: Date;
    updatedAt?: Date | null;
  }
  