import { cn } from "@/utils/tailwind/cn";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useState } from "react";

interface ButtonSaveProps {
  isPending: boolean;
  label?: string;
  pendingLabel?: string;
  handleOnClick?: () => void;
  className?: string;
}
export const ButtonSave = ({
  isPending: externalPending = false,
  label = "Guardar",
  pendingLabel = "Guardando...",
  handleOnClick,
  className = "",
}: ButtonSaveProps) => {
  const { pending: formPending } = useFormStatus(); // Detecta si está dentro de un form
  const [localPending, setLocalPending] = useState(false);

  const handleClick = async () => {
    if (localPending || externalPending || formPending) return;

    setLocalPending(true);
    try {
      await handleOnClick?.();
    } finally {
      setLocalPending(false);
    }
  };

  const isDisabled = formPending || externalPending || localPending;

  return (
    <Button
      id="btn-save"
      type="submit"
      variant={"default"}
      disabled={isDisabled}
      className={cn(
        className,
        // "bg-green-800 text-white hover:bg-green-900 text-lg",
        {
          "bg-yellow-900 text-slate-800 font-bold disabled:opacity-100 disabled:bg-opacity-100":
            isDisabled,
        }
      )}
      onClick={handleOnClick ? handleClick : undefined} // Solo usa onClick si se pasa handleOnClick
    >
      {isDisabled ? pendingLabel : label}
    </Button>
  );
};
