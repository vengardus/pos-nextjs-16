import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import {
  PaymentMethodFormSchema,
  PaymentMethodFormSchemaType,
} from "@/app/(features)/config/payment-methods/schemas/payment-method-form.schema";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { paymentMethodInsertOrUpdate } from "@/actions/payment-methods/payment-method.insert-or-update.action";
import { getModelMetadata } from "@/server/common/model-metadata";

const defaultValues: PaymentMethodFormSchemaType = {
  name: "",
  color: "",
  cod: "",
  isDefault: false,
};

interface PaymentMethodFormProps {
  currentRow: PaymentMethod | null;
  companyId: string;
}
export const usePaymentMethodForm = ({
  currentRow,
  companyId,
}: PaymentMethodFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const isNewRecord = !currentRow;
  const paymentMethodMetadata = getModelMetadata("paymentMethod");

  const form = useForm<PaymentMethodFormSchemaType>({
    resolver: zodResolver(PaymentMethodFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            name: currentRow!.name,
            color: currentRow!.color,
            cod: currentRow!.cod,
            isDefault: currentRow!.isDefault,
          }
    );
  }, [isNewRecord, currentRow, form]);

  const handleSave = async (values: PaymentMethodFormSchemaType) => {
    values.name = toCapitalize(values.name);
    // determinar si es insert or update
    setIsPending(true);

    const paymentMethod: PaymentMethod = isNewRecord
      ? {
          id: "",
          name: values.name,
          cod: values.cod,
          color: values.color,
          companyId: companyId,
          isDefault: false,
        }
      : {
          ...currentRow!,
          name: values.name,
          color: values.color,
          cod: values.cod,
        };

    const resp = await paymentMethodInsertOrUpdate(
      paymentMethod
    );

    if (resp.success) {
      if (isNewRecord) currentRow = resp.data;
      toast.success(
        `${paymentMethodMetadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );

      setTimeout(() => {
        // Luego de esperar, navegar a la ruta
        //window.location.href = '/pos';
      }, 1000); // Esperar 2 segundos

    } else {
      toast.error(
        `Error: No se pudo grabar ${paymentMethodMetadata.singularName}`,
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
