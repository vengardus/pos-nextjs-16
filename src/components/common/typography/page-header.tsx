"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface PageHeaderProps {
  title: string;
  breadcrumb: string | BreadcrumbItem[];
  backRoute?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  breadcrumb,
  backRoute,
  actions,
}: PageHeaderProps) {
  const breadcrumbItems: BreadcrumbItem[] = Array.isArray(breadcrumb)
    ? breadcrumb
    : breadcrumb.split("/").map((segment) => ({
        label: segment.trim(),
      }));

  if (backRoute && breadcrumbItems.length > 1) {
    const linkIndex = breadcrumbItems.length - 2;
    breadcrumbItems[linkIndex] = {
      ...breadcrumbItems[linkIndex],
      href: backRoute,
    };
  }

  return (
    <div className="z-50 mb-1 border-b border-muted/20 bg-background/80 py-2 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
        <div className="flex items-center gap-2 min-w-0 w-1/3">
          {backRoute ? (
            <Link
              href={backRoute}
              className="text-muted-foreground transition-transform hover:-translate-x-1 hover:text-foreground"
              aria-label="Volver"
            >
              <ChevronLeft size={16} />
            </Link>
          ) : null}
          <div className="flex items-center gap-1 text-sm font-medium whitespace-nowrap overflow-hidden">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const itemKey = `${item.label}-${index}`;
              const itemClasses = isLast
                ? "text-foreground"
                : "text-muted-foreground/60";

              return (
                <span key={itemKey} className={`${itemClasses} shrink-0`}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  {!isLast ? " / " : null}
                </span>
              );
            })}
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2 w-2/3">{actions}</div> : null}
        <span className="sr-only">{title}</span>
      </div>
    </div>
  );
}
