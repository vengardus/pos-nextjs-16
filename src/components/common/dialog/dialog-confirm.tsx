import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ActionType = "delete";
interface ActionValues {
  title: string;
  description: string;
}
const values: Record<ActionType, ActionValues> = {
  delete: {
    title: "¿Está seguro de eliminar?",
    description: "Esta acción eliminará permanentemente el registro.",
  },
};
interface DialogConfirmProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAction: () => void;
  type?: ActionType;
}

export const DialogConfirm = ({
  open,
  setOpen,
  handleAction,
  type = "delete",
}: DialogConfirmProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{values[type].title}</AlertDialogTitle>
          <AlertDialogDescription>
            {values[type].description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
