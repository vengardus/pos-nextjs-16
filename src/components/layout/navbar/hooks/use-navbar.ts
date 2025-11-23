import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

import { AppConstants } from "@/constants/app.constants";
import type { NavbarItem } from "@/types/interfaces/ui/navbar-item.interface";
import { UserRole } from "@/types/enums/user-role.enum";
import { useCartStore } from "@/stores/cart/cart.store";
import { useBranchStore } from "@/stores/branch/branch.store";
import { useCashRegisterStore } from "@/stores/cash-register/cash-register.store";
import { useClientSupplierStore } from "@/stores/client-supplier/client-supplier.store";
import { useCompanyStore } from "@/stores/company/company.store";
import { usePaymentMethodStore } from "@/stores/payment-method/payment-method.store";
import { useProductStore } from "@/stores/product/product.store";
import { useDocumentTypeStore } from "@/stores/document-type/document-type.store";
import { useRoleStore } from "@/stores/role/role.store";
import { usePermissionStore } from "@/stores/permission/permission.store";
import { useCashRegisterDecisionStore } from "@/stores/cash-register/cash-register-decision.store";

interface useNavbarProps {
  isAuthenticated: boolean;
  userRole: UserRole | undefined;
}
export const useNavbar = ({ isAuthenticated, userRole }: useNavbarProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuProfileOpen, setIsMenuProfileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const navbarItemsAuth = AppConstants.NAVBAR_ITEMS.filter(
    (item) =>
      !item.role ||
      //(isAuthenticated && userRole === UserRole.ADMIN) ||
      (isAuthenticated && userRole === UserRole.SUPER_ADMIN) ||
      (isAuthenticated && item.role === userRole)
  );

  const clearAllStore = () => {
    useCartStore.persist.clearStorage();
    useBranchStore.persist.clearStorage();
    useCashRegisterStore.persist.clearStorage();
    useClientSupplierStore.persist.clearStorage();
    useCompanyStore.persist.clearStorage();
    usePaymentMethodStore.persist.clearStorage();
    useProductStore.persist.clearStorage();
    useDocumentTypeStore.persist.clearStorage();
    useRoleStore.persist.clearStorage();
    usePermissionStore.persist.clearStorage();
    useCashRegisterDecisionStore.persist.clearStorage();
  };

  const handledSelectedItem = async (navbarItem: NavbarItem) => {
    const { name, children, href } = navbarItem;

    if (children) return;
    //if (href) router.push(href);
    startTransition(async () => {
      if (href) {
        router.push(href);
      }

      switch (name.toLowerCase()) {
        case "login":
          await signIn();
          break;

        case "logout":
          clearAllStore();
          await signOut({
            redirectTo: AppConstants.URL_HOME,
          });
          break;
      }
    });
  };

  return {
    handledSelectedItem,
    isMenuOpen,
    setIsMenuOpen,
    navbarItemsAuth,
    isMenuProfileOpen,
    setIsMenuProfileOpen,
    isPending,
  };
};
