import { Company } from "@/server/modules/company/domain/company.interface";
import { Permission } from "@/server/modules/permission/domain/permission.interface";

export interface Role {
  id: string;
  cod: string     
  description: string
  isDefault?: boolean
   // relati
  Company?: Company   
  Permission?: Permission[]
}
