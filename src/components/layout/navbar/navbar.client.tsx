"use client";

// NavBar.v1.0
import { memo } from "react";

import { cn } from "@/utils/tailwind/cn";

import { AppConstants } from "@/constants/app.constants";
import type { UserRole } from "@/types/enums/user-role.enum";
import { useGetSession } from "@/hooks/auth/use-get-session";
import { useNavbar } from "@/components/layout/navbar/hooks/use-navbar";

import { NavbarLogoApp } from "./navbar-logo-app";
import { NavbarButtonSignIn } from "./navbar-button-sign-in";
import { NavbarButtonMenuMobile } from "./navbar-button-menu-mobile";
import { NavbarMenu } from "./navbar-menu";
import { NavbarProfile } from "./navbar-profile";

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
  if (isLoading) return <div className="nav">Loading...</div>;
  
  console.log("Rendering Navbar")

  return (
    <nav>
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
          className={cn("menu-bar", {
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
          handledSelectedItem={ (item) => {
            handledSelectedItem(item)
            setIsMenuProfileOpen(!isMenuProfileOpen)
          }
          }
          navbarItemsAuth={AppConstants.NAVBAR_ITEMS_PROFILE}
          className={cn("menu-profile")}
          isPending={isPending}
        />
      )}
    </nav>
  );
}

export default memo(Navbar);
