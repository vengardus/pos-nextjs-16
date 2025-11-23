import { Company } from "../company/company.interface";
import { Permission } from "../permission/permission.interface";

export interface Role {
  id: string;
  cod: string     
  description: string
  isDefault?: boolean
   // relati
  Company?: Company   
  Permission?: Permission[]
}
