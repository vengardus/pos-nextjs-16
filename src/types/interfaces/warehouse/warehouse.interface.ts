export interface Warehouse {
  id: string;
  stock: number;
  minimumStock: number;
  branchId: string;
  productId: string;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}
