export interface Product {
  id: string;
  name: string;
  salePrice: number;
  purchasePrice: number;
  barcode?: string | null;
  internalCode?: string | null;
  unitSale: string;
  isInventoryControl?: boolean;
  isMultiPrice?: boolean;
  companyId: string;
  categoryId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;

  // auxiliares
  categoryName?: string;    // para uso en ProductList - ListTable
}
