import { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";

export interface Branch {
    id: string;
    name: string;
    taxAddress: string | null;
    currencySymbol: string;
    isDefault: boolean;
    companyId: string;
    CashRegister?: CashRegister[]

    //createdAt: Date;
    //updatedAt?: Date | null;
}
