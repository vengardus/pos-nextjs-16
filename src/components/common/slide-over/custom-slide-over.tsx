"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/utils/tailwind/cn";

interface CustomSlideOverContextValue {
  setFooterContent: (content: ReactNode) => void;
}

const CustomSlideOverContext = createContext<CustomSlideOverContextValue | null>(
  null
);

export const useCustomSlideOver = () => useContext(CustomSlideOverContext);

interface CustomSlideOverProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export const CustomSlideOver = ({
  title,
  onClose,
  children,
  className,
  footer,
}: CustomSlideOverProps) => {
  const [footerContent, setFooterContent] = useState<ReactNode>(
    footer ?? null
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (footer !== undefined) {
      setFooterContent(footer);
    }
  }, [footer]);

  const contextValue = useMemo(
    () => ({ setFooterContent }),
    [setFooterContent]
  );

  return (
    <CustomSlideOverContext.Provider value={contextValue}>
      <Sheet
        open
        modal={!isMobile}
        onOpenChange={(open) => !open && onClose()}
      >
        <SheetContent
          side="right"
          className={cn(
            "!fixed !inset-y-0 !right-0 !h-screen !rounded-none !m-0 w-full sm:max-w-2xl p-0 flex flex-col shadow-2xl border-l",
            className
          )}
        >
          <SheetHeader className="sticky top-0 z-10 flex flex-row items-center justify-between bg-background px-6 py-4">
            <SheetTitle className="text-lg font-semibold text-foreground">
              {title}
            </SheetTitle>
            <SheetClose asChild>
              <button
                type="button"
                aria-label="Cerrar"
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
          <SheetFooter className="sticky bottom-0 z-10 border-t bg-background px-6 py-4">
            {footerContent}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </CustomSlideOverContext.Provider>
  );
};
