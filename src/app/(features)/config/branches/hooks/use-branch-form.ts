import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import {
  BranchFormSchema,
  BranchFormSchemaType,
} from "@/app/(features)/config/branches/schemas/branch-form.schema";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { branchInsertOrUpdateAction } from "@/server/modules/branch/next/actions/branch.insert-or-update.action";
import { getModelMetadata } from "@/server/common/model-metadata";

const defaultValues: BranchFormSchemaType = {
  name: "",
  taxAddredss: "",
  isDefault: false,
};

interface BranchFormProps {
  currentRow: Branch | null;
  companyId: string;
}
export const useBranchForm = ({ currentRow, companyId }: BranchFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(null);
  const isNewRecord = !currentRow;
  const branchMetadata = getModelMetadata("branch");

  const form = useForm<BranchFormSchemaType>({
    resolver: zodResolver(BranchFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            name: currentRow!.name,
            taxAddredss: currentRow!.taxAddress ?? undefined,
            isDefault: currentRow!.isDefault,
          }
    );
  }, [isNewRecord, currentRow, form]);

  const handleSave = async (values: BranchFormSchemaType) => {
    values.name = toCapitalize(values.name);
    // determinar si es insert or update
    setIsPending(true);

    console.log("IsNewRecord", isNewRecord);

    const branch: Branch = isNewRecord
      ? {
          id: "",
          name: values.name,
          taxAddress: values.taxAddredss ?? null,
          companyId: companyId,
          isDefault: false,
          currencySymbol: "",
        }
      : {
          ...currentRow!,
          name: values.name,
          taxAddress: values.taxAddredss ?? null,
          currencySymbol: "",
        };

    console.log("Branch", branch);
    const resp = await branchInsertOrUpdateAction(branch);

    if (resp.success) {
      if (isNewRecord) currentRow = resp.data;
      toast.success(
        `${branchMetadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(`Error: No se pudo grabar ${branchMetadata.singularName}`, {
        description: resp.message,
      });
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
