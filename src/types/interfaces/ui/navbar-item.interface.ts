// NavBar.v1.0
import { UserRole } from "../../enums/user-role.enum";

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