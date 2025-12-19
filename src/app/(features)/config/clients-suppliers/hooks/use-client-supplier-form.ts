import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";
import {
  ClientSupplierFormSchema,
  ClientSupplierFormSchemaType,
} from "@/app/(features)/config/clients-suppliers/schemas/client-supplier-form.schema";
import { AppConstants } from "@/constants/app.constants";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { formatOptionalField } from "@/utils/formatters/format-optional-field";
import { clientSupplierInsertOrUpdate } from "@/actions/clients-suppliers/client-supplier.insert-or-update.action";
import { getModelMetadata } from "@/server/common/model-metadata";

const defaultValues: ClientSupplierFormSchemaType = {
  name: "",
  address: "",
  email: "",
  personType: "",
  naturalIdentifier: "",
  legalIdentifier: "",
  phone: "",
};

interface ClientSupplierFormProps {
  currentRow: ClientSupplier | null;
  companyId: string;
}
export const useClientSupplierForm = ({
  currentRow,
  companyId,
}: ClientSupplierFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const isNewRecord = !currentRow;
  const clientSupplierMetadata = getModelMetadata("clientSupplier");

  const form = useForm<ClientSupplierFormSchemaType>({
    resolver: zodResolver(ClientSupplierFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            name: currentRow!.name,
            address: currentRow!.address ?? undefined,
            email: currentRow!.email ?? undefined,
            personType: currentRow!.personType,
            naturalIdentifier: currentRow!.naturalIdentifier ?? undefined,
            legalIdentifier: currentRow!.legalIdentifier ?? undefined,
            phone: currentRow!.phone ?? undefined,
          }
    );
  }, [isNewRecord, currentRow, form]);

  const handleSave = async (values: ClientSupplierFormSchemaType) => {
    values.name = toCapitalize(values.name);
    // determinar si es insert or update
    setIsPending(true);

    const clientSupplier: ClientSupplier = isNewRecord
      ? {
          id: "",
          name: values.name,
          address: formatOptionalField(values.address),
          email: formatOptionalField(values.email),
          naturalIdentifier: formatOptionalField(values.naturalIdentifier),
          legalIdentifier: formatOptionalField(values.legalIdentifier),
          phone: formatOptionalField(values.phone),
          personType: values.personType,
          status: AppConstants.DEFAULT_VALUES.states.active,
          companyId: companyId,
          isDefault: false,
          createdAt: new Date(),
        }
      : {
          ...currentRow!,
          name: values.name,
          address: formatOptionalField(values.address),
          email: formatOptionalField(values.email),
          naturalIdentifier: formatOptionalField(values.naturalIdentifier),
          legalIdentifier: formatOptionalField(values.legalIdentifier),
          phone: formatOptionalField(values.phone),
          personType: values.personType,
          updatedAt: new Date(),
        };

    const resp = await clientSupplierInsertOrUpdate(clientSupplier);

    if (resp.success) {
      if (isNewRecord) currentRow = resp.data;
      toast.success(
        `${clientSupplierMetadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${clientSupplierMetadata.singularName}`,
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
