// NavBar.v1.0
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";

export interface NavbarItem {
  name: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  isSeparator?: boolean;
  role?: UserRole;
  children?: NavbarItem[];
  isSystem?: boolean;
}
