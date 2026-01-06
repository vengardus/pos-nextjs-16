export interface Company {
  id: string;
  name: string;
  userId: string;
  authId: string;
  currencySymbol: string;
  imageUrl: string | null;
  taxAddress: string | null;
  taxGlose: string;
  taxValue: number;
  isDefault: boolean;
  iso: string;
  country: string;
  currency: string;
}
