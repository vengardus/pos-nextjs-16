"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { NavbarItem } from "@/shared/types/ui/navbar-item.interface";

interface NavbarProfileMenuProps {
  image: string;
  items: NavbarItem[];
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onSelectItem: (item: NavbarItem) => void;
}

export const NavbarProfileMenu = ({
  image,
  items,
  isOpen,
  onOpenChange,
  onSelectItem,
}: NavbarProfileMenuProps) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={image} alt="image" />
          <AvatarFallback>img-prof</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[1400] min-w-[12rem] rounded-lg border-2 border-foreground/15 bg-slate-400/95 p-2 text-foreground/70 shadow-lg dark:bg-background"
      >
        {items.map((item, index) =>
          item.isSeparator ? (
            <DropdownMenuSeparator
              key={`separator-${index}`}
              className="my-2 bg-foreground/15"
            />
          ) : item.children ? (
            <DropdownMenuSub key={item.name}>
              <DropdownMenuSubTrigger className="rounded-md px-3 py-2 font-semibold uppercase tracking-widest text-foreground/70 focus:bg-accent focus:text-foreground">
                {item.label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="z-[1500] min-w-[11rem] rounded-lg border-2 border-foreground/15 bg-slate-400/95 p-2 text-foreground/70 shadow-lg dark:bg-background">
                {item.children.map((subItem) => (
                  <DropdownMenuItem
                    key={subItem.name}
                    className="gap-2 rounded-md px-3 py-2 text-foreground/70 focus:bg-accent focus:text-foreground"
                    onClick={() => onSelectItem(subItem)}
                  >
                    {subItem.icon}
                    {subItem.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem
              key={item.name}
              className="gap-2 rounded-md px-3 py-2 text-foreground/70 focus:bg-accent focus:text-foreground"
              onClick={() => onSelectItem(item)}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
