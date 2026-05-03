"use client";

// NavBar.v1.0
import { memo } from "react";

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
  "fixed top-0 z-40 w-full h-16 pr-1 flex py-2 justify-start items-center flex-col sm:flex-row bg-slate-300 dark:bg-background text-foreground/50 border-b-2 border-t-2 border-foreground/10";

const menuBarBaseClass =
  "flex-col sm:flex sm:flex-row w-full items-baseline sm:items-center sm:justify-end gap-6 sm:gap-4 pl-3 sm:pl-0 pr-6 bg-slate-300 dark:bg-background text-foreground/50 border-0 fixed top-16 left-0 w-3/5 sm:relative sm:top-0 sm:w-full";

const menuProfileBaseClass =
  "flex flex-col bg-slate-400/60 dark:bg-background text-foreground/50 border-2 border-foreground/15 rounded-lg px-5 items-start gap-3 fixed top-16 right-1 w-auto h-auto";

function Navbar ()  {
  const { isAuthenticated, sessionUser, isLoading } = useGetSession();
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
  
  //TODO: skeleton pendiente
  if (isLoading) return <div className={navBaseClass}>Loading...</div>;
  
  console.log("Rendering Navbar")

  return (
    <nav className={navBaseClass}>
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
            setIsMenuOpen(!isMenuOpen)
          }}
          navbarItemsAuth={navbarItemsAuth}
          className={cn(menuBarBaseClass, {
            "flex h-[2/5] py-5 ": isMenuOpen,
            hidden: !isMenuOpen,
          })}
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
          className={cn(menuProfileBaseClass)}
          isPending={isPending}
        />
      )}
    </nav>
  );
}

export default memo(Navbar);
