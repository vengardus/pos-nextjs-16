export type Category = {
  id: string;
  name: string;
  imageUrl?: string | null;
  color: string;
  companyId: string;
  isDefault: boolean;

  createdAt: Date;
  updatedAt?: Date | null;
};

