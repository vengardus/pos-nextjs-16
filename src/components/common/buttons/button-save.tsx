import { cn } from "@/utils/tailwind/cn";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useState } from "react";

interface ButtonSaveProps {
  isPending: boolean;
  label?: string;
  pendingLabel?: string;
  handleOnClick?: () => void;
  className?: string;
  size?: ButtonProps["size"];
  // Propiedades añadidas para soporte de Slide-Overs/Portals
  form?: string; 
  type?: "submit" | "button" | "reset";
}

export const ButtonSave = ({
  isPending: externalPending = false,
  label = "Guardar",
  pendingLabel = "Guardando...",
  handleOnClick,
  className = "",
  size,
  form,
  type = "submit",
}: ButtonSaveProps) => {
  const { pending: formPending } = useFormStatus();
  const [localPending, setLocalPending] = useState(false);

  const handleClick = async () => {
    if (localPending || externalPending || formPending) return;

    if (handleOnClick) {
      setLocalPending(true);
      try {
        await handleOnClick();
      } finally {
        setLocalPending(false);
      }
    }
  };

  const isDisabled = formPending || externalPending || localPending;

  return (
    <Button
      id="btn-save"
      type={type}
      form={form} // Vincula el botón al formulario por ID
      size={size}
      variant={"default"}
      disabled={isDisabled}
      className={cn(
        className,
        {
          "bg-warning text-warning-foreground font-bold disabled:opacity-100 disabled:bg-opacity-100":
            isDisabled,
        }
      )}
      onClick={handleOnClick ? handleClick : undefined}
    >
      {isDisabled ? pendingLabel : label}
    </Button>
  );
};
