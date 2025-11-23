import { Button } from "@/components/ui/button";

interface ButtonCancelProps {
    handleCloseForm: () => void;
    isPending: boolean;
}
export const ButtonCancel = ({handleCloseForm, isPending}: ButtonCancelProps) => {
  return (
    <Button
      type="button"
      variant={"secondary"}
      onClick={handleCloseForm}
      disabled={isPending}
    >
      Cancelar
    </Button>
  );
};
