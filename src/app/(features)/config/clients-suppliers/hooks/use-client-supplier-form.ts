import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";
import { ClientSupplierBusiness } from "@/business/client-supplier.business";
import {
  ClientSupplierFormSchema,
  ClientSupplierFormSchemaType,
} from "@/app/(features)/config/clients-suppliers/schemas/client-supplier-form.schema";
import { AppConstants } from "@/constants/app.constants";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { formatOptionalField } from "@/utils/formatters/format-optional-field";
import { clientSupplierInsertOrUpdate } from "@/actions/clients-suppliers/mutations/client-supplier.insert-or-update.action";

const defaultValues: ClientSupplierFormSchemaType = {
  name: "",
  address: "",
  email: "",
  personType: "",
  naturalIdentifier: "",
  legalIdentifier: "",
  phone: "",
};

interface ClientFormProps {
  currentClientSupplier: ClientSupplier | null;
  companyId: string;
}
export const useClientSupplierForm = ({
  currentClientSupplier,
  companyId,
}: ClientFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const isNewRecord = !currentClientSupplier;

  const form = useForm<ClientSupplierFormSchemaType>({
    resolver: zodResolver(ClientSupplierFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            name: currentClientSupplier!.name,
            address: currentClientSupplier!.address?? undefined,
            email: currentClientSupplier!.email ?? undefined,
            personType: currentClientSupplier!.personType,
            naturalIdentifier: currentClientSupplier!.naturalIdentifier ?? undefined,
            legalIdentifier: currentClientSupplier!.legalIdentifier ?? undefined,
            phone: currentClientSupplier!.phone ?? undefined
          }
    );
  }, [isNewRecord, currentClientSupplier, form]);

  const handleClientSave = async (values: ClientSupplierFormSchemaType) => {
    values.name = toCapitalize(values.name);
    // determinar si es insert or update
    setIsPending(true);

    const clientSupplier: ClientSupplier = isNewRecord
      ? {
          id: "",
          name: values.name,
          //color: values.color,
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
          ...currentClientSupplier!,
          name: values.name,
          address: formatOptionalField(values.address),
          email: formatOptionalField(values.email),
          naturalIdentifier: formatOptionalField(values.naturalIdentifier),
          legalIdentifier: formatOptionalField(values.legalIdentifier),
          phone: formatOptionalField(values.phone),
          personType: values.personType,
          updatedAt: new Date(),
        };

    const resp = await clientSupplierInsertOrUpdate(
      clientSupplier,
    );

    if (resp.success) {
      if (isNewRecord) currentClientSupplier = resp.data;
      toast.success(
        `${ClientSupplierBusiness.metadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${ClientSupplierBusiness.metadata.singularName}`,
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
    handleClientSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  };
};
