"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/tailwind/cn";
import { AppConstants } from "@/constants/app.constants";

export const CompaniesSidebar = () => {
  const pathname = usePathname();
  
  return (
    <section className="flex flex-col gap-5 mb-7">
      {AppConstants.COMPANY_OPTIONS.map((option) => {
        return (
          <div key={option.label} className="flex flex-col gap-3 border p-3">
            <h1 className="font-bold">{option.label}</h1>
            <div className="flex flex-col gap-3 ml-7 text-foreground/50">
              {option.subOptions.map((subOption) => {
                return (
                  <Link 
                    href={subOption.link}
                    key={subOption.label}
                    className={cn("hover:text-foreground/90", {
                      "text-foreground/90 border border-foreground/50 rounded-xl bg-foreground/10 p-1.5" : (subOption.link === pathname)
                    })}
                  >
                    {subOption.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};
