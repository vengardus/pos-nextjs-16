import { Product } from "@/server/modules/product/domain/product.interface";
import { User } from "@/server/modules/user/domain/user.interface";

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
  
