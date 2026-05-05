"use client";

import { memo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind/cn";
import { AppConstants } from "@/shared/constants/app.constants";
import type { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { useGetSession } from "@/shared/hooks/auth/use-get-session";
import { useNavbar } from "@/components/layout/navbar/hooks/use-navbar";

import { NavbarLogoApp } from "./navbar-logo-app";
import { NavbarButtonSignIn } from "./navbar-button-sign-in";
import { NavbarButtonMenuMobile } from "./navbar-button-menu-mobile";
import { NavbarMenu } from "./navbar-menu";
import { NavbarProfile } from "./navbar-profile";

const navBaseClass =
  "fixed top-0 z-[1000] w-full pr-1 flex justify-start items-center flex-col sm:flex-row bg-slate-300 dark:bg-background text-foreground/50 border-b-2 border-t-2 border-foreground/10 transition-[height,padding]";

const menuBarBaseClass =
  "flex-col sm:flex sm:flex-row w-full items-center sm:items-center justify-center sm:justify-end gap-6 sm:gap-4 px-6 sm:pl-0 sm:pr-6 py-8 sm:py-0 bg-slate-300 dark:bg-background text-foreground/50 border-0 fixed left-0 right-0 z-[1200] sm:relative sm:inset-auto sm:z-auto sm:w-full transition-[top]";

const menuProfileBaseClass =
  "flex flex-col bg-slate-400/60 dark:bg-background text-foreground/50 border-2 border-foreground/15 rounded-lg px-5 items-start gap-3 fixed right-1 w-auto h-auto z-[1300] shadow-lg";

function Navbar ()  {
  const pathname = usePathname();
  const { isAuthenticated, sessionUser, isLoading } = useGetSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    isMenuOpen,
    setIsMenuOpen,
    handledSelectedItem,
    navbarItemsAuth,
    isMenuProfileOpen,
    setIsMenuProfileOpen,
    isPending
  } = useNavbar({
    isAuthenticated,
    userRole: sessionUser?.role as UserRole,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMenuProfileOpen(false);
  }, [pathname, setIsMenuOpen, setIsMenuProfileOpen]);
  
  if (isLoading) return <div className={navBaseClass}>Loading...</div>;

  return (
    <nav
      className={cn(
        navBaseClass,
        isScrolled ? "h-12 py-1" : "h-16 py-2"
      )}
    >
      <div className="flex justify-between w-full items-center px-3 h-full">
        <NavbarButtonMenuMobile
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <NavbarLogoApp />

        <NavbarMenu
          isMenuOpen={isMenuOpen}
          handledSelectedItem={(item)=> {
            handledSelectedItem(item)
            if (!item.children && (!item.href || item.href === pathname)) {
              setIsMenuOpen(false);
            }
          }}
          navbarItemsAuth={navbarItemsAuth}
          className={cn(
            menuBarBaseClass,
            isScrolled
              ? "top-12 h-[calc(100dvh-3rem)] sm:top-0 sm:h-auto"
              : "top-16 h-[calc(100dvh-4rem)] sm:top-0 sm:h-auto",
            {
            "flex overflow-y-auto": isMenuOpen,
            hidden: !isMenuOpen,
          }
          )}
          isPending={isPending}
        />

        {!isAuthenticated ? (
          <NavbarButtonSignIn
            handledSelectedItem={handledSelectedItem}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <NavbarProfile
            image={sessionUser?.image ?? ""}
            isMenuProfileOpen={isMenuProfileOpen}
            setIsMenuProfileOpen={setIsMenuProfileOpen}
          />
        )}
      </div>

      {isAuthenticated && isMenuProfileOpen && (
        <NavbarMenu
          isMenuOpen={isMenuOpen}
          handledSelectedItem={(item) => {
            handledSelectedItem(item);
            if (!item.children) {
              setIsMenuProfileOpen(!isMenuProfileOpen);
            }
          }}
          navbarItemsAuth={AppConstants.NAVBAR_ITEMS_PROFILE}
          className={cn(
            menuProfileBaseClass,
            isScrolled ? "top-12 mt-1" : "top-16 mt-1"
          )}
          isPending={isPending}
        />
      )}
    </nav>
  );
}

export default memo(Navbar);
