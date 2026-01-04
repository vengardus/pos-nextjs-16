import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { CashRegister } from "@/server/modules/cash-register/domain/cash-register.types";
import {
  CashRegisterFormSchema,
  CashRegisterFormSchemaType,
} from "@/app/(features)/config/branches/schemas/cash-register-form.schema";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { useBranchStore } from "@/stores/branch/branch.store";
import { initResponseAction } from "@/utils/response/init-response-action";
import { cashRegisterInsertOrUpdateAction } from "@/server/modules/cash-register/next/actions/cash-register.insert-or-update.action";
import { getModelMetadata } from "@/server/common/model-metadata";

const defaultValues: CashRegisterFormSchemaType = {
  description: "",
  isDefault: false,
};

interface CashRegisterFormProps {
  currentRow: CashRegister | null;
}
export const useCashRegisterForm = ({ currentRow }: CashRegisterFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const isNewRecord = !currentRow;
  const cashRegisterMetadata = getModelMetadata("cashRegister");

  const form = useForm<CashRegisterFormSchemaType>({
    resolver: zodResolver(CashRegisterFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            description: currentRow!.description,
            isDefault: currentRow!.isDefault,
          }
    );
    console.log("selectedBranch", currentRow);
  }, [isNewRecord, currentRow, form]);

  const handleSave = async (values: CashRegisterFormSchemaType) => {
    const resp = initResponseAction();
    if ( !selectedBranch) {
      resp.message = "No hay una sucursal seleccionada";
      return resp
    }

    values.description = toCapitalize(values.description);
    setIsPending(true);
    // determinar si es insert or update
    const cashRegister: CashRegister = isNewRecord
      ? {
          id: "",
          description: values.description,
          branchId: selectedBranch.id,
          isDefault: false,
        }
      : {
          ...currentRow!,
          description: values.description,
          branchId: selectedBranch.id,

        };

    console.log("CashRegister", cashRegister, currentRow);
    const respInsertOrUpdate =
      await cashRegisterInsertOrUpdateAction(cashRegister);

    if (respInsertOrUpdate.success) {
      if (isNewRecord) currentRow = resp.data;
      resp.success = true
      resp.data = respInsertOrUpdate.data
      toast.success(
        `${cashRegisterMetadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      resp.message = respInsertOrUpdate.message
      toast.error(
        `Error: No se pudo grabar ${cashRegisterMetadata.singularName}`,
        {
          description: resp.message,
        }
      );
    }

    setIsPending(false);
    return resp;
  };

  return {
    form,
    handleSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  };
};
