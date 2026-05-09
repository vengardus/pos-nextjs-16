import { cn } from "@/utils/tailwind/cn";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  className?: string;
  handleCloseForm?: () => void;
  showCloseIcon?: boolean;
  children: React.ReactNode;
}
export const Modal = ({
  className = "w-[85%] h-[80%]",
  handleCloseForm,
  showCloseIcon = true,
  children,
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 top-16 z-[1200] flex items-center justify-center bg-slate-50/95 dark:bg-background/90">
      <div
        className={cn(
          "fixed z-[1210] h-[80%] w-[80%] overflow-y-auto rounded-lg bg-background shadow-lg",
          className
        )}
      >
        {handleCloseForm && showCloseIcon && (
          <X className="absolute right-4 top-4" onClick={() => handleCloseForm?.()} />
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};
