import { Company } from "@/types/interfaces/company/company.interface";

export interface ClientSupplier {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  naturalIdentifier: string | null;
  legalIdentifier: string | null;
  phone: string | null;
  personType: string;
  isDefault: boolean;
  status: string;

  // relations
  companyId: string;
  Company?: Company;

  createdAt: Date;
  updatedAt?: Date | null;
}
