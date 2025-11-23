import { Product } from "../product/product.interface";
import { User } from "../user/user.interface";

export interface Kardex {
    id: string;
    motive: string;
    quantity: number;
    type: string;
    status: string;
    total: number;
    cost: number;
    previousStock: number;
    currentStock: number;
  
    // relations
    userId: string;
    productId: string;
    User: User;
    Product: Product;
  
    createdAt: Date;
    updatedAt?: Date | null;
  }
  