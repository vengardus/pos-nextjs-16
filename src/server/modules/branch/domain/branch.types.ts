import { CashRegister } from "@/server/modules/cash-register/domain/cash-register.types";

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
