//import { UserRole } from "../app/user-role.enum";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  imageUrl?: string | null;
  roleId: string //UserRole;
  authId?: string | null;
  authType: string

  documentTypeId?: string | null;
  documentNumber?: string | null;
  phone?: string | null;
  address?: string | null;

  //branchId?: string | null;
  //cashRegisterId?: string | null;

  createdAt?: Date;
  //updatedAt?: Date;
}
