export interface PaymentMethod {
    id: string;
    name: string;
    isDefault: boolean;
    cod: string
    color?: string
    companyId: string;
}