import { MenuIcon, X } from "lucide-react";

interface NavbarButtonMenuMobileProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}
export const NavbarButtonMenuMobile = ({
  isMenuOpen,
  setIsMenuOpen,
}: NavbarButtonMenuMobileProps) => {
  return (
    <button
      id="menu-button"
      aria-label="Menu"
      className="border border-foreground sm:hidden"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {!isMenuOpen ? (
        <MenuIcon className="sm:hidden size-8" />
      ) : (
        <X className="sm:hidden size-8" />
      )}
    </button>
  );
};
