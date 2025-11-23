"use client"

import { cn } from "@/utils/tailwind/cn";
import { Button } from "@/components/ui/button";

interface ButtonIconProps {
  children?: React.ReactNode;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
  handleClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties
}
export const ButtonIcon = ({
  children,
  label,
  variant = "default",
  className,
  handleClick,
  disabled=false,
  style
}: ButtonIconProps) => {
  return (
    <Button
      variant={variant}
      className={cn("flex items-center justify-center", className)}
      onClick={() => {
        console.log("handleClick", handleClick);
        if (handleClick) {
          handleClick();
        }
      }}
      disabled={disabled}
      style={style}
    >
      <div className="flex items-center justify-center gap-2">
        {children} 
        <span className="flex items-center">{label}</span>
      </div>
    </Button>
  );
};
