import type { Product } from "@/types/interfaces/product/product.interface";
import type { Sale } from "./sale.interface";

export interface SaleDetail {
  id: string;
  quantity: number;
  salePrice: number;
  total: number;
  description: string;
  purchasePrice: number;
  status: string;

  // relations
  saleId: string;
  productId: string;
  Sale?: Sale;
  Product?: Product;

  createdAt: Date;
  updatedAt?: Date | null;
}
