export interface Brand {
    id: string;
    name: string;
    isDefault: boolean;
    companyId: string;
    createdAt: Date;
    updatedAt?: Date | null;
}