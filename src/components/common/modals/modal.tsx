import { cn } from "@/utils/tailwind/cn";
import { X } from "lucide-react";

interface ModalProps {
  className?: string;
  handleCloseForm?: () => void;
  children: React.ReactNode;
}
export const Modal = ({ className = "w-[85%] h-[80%]", handleCloseForm, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-background opacity-100 z-20 flex justify-center items-center top-16">
      <div
        className={cn(
          "fixed bg-background  shadow-lg rounded-lg z-30 w-[80%] h-[80%] overflow-y-auto",
          className
        )}
      >
        {
          handleCloseForm && (
            <X className="absolute right-4 top-4" onClick={() => handleCloseForm?.()}/>
          )
        }
        {children}
      </div>
    </div>
  );
};
