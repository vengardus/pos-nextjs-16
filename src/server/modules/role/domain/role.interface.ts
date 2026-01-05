import { Company } from "@/types/interfaces/company/company.interface";
import { Permission } from "@/types/interfaces/permission/permission.interface";

export interface Role {
  id: string;
  cod: string     
  description: string
  isDefault?: boolean
   // relati
  Company?: Company   
  Permission?: Permission[]
}
