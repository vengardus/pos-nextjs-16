import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Company } from "@/types/interfaces/company/company.interface";
import { CompanyBusiness } from "@/business/company.business";
import {
  CompanyFormSchema,
  CompanyFormSchemaType,
} from "@/app/(features)/config/companies/schemas/company-form.schema";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { companyUpdate } from "@/actions/companies/mutations/company.update.action";

const defaultValues: CompanyFormSchemaType = {
  name: "",
  taxAddress: "",
  taxGlose: "IGV",
  taxValue: 18.0,
  imageUrl: undefined,
};

interface CompanyFormProps {
  currentCompany: Company | null;
  companyId: string;
}
export const useCompanyForm = ({ currentCompany }: CompanyFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const isNewRecord = !currentCompany;

  const form = useForm<CompanyFormSchemaType>({
    resolver: zodResolver(CompanyFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            name: currentCompany!.name,
            taxValue: currentCompany!.taxValue,
            taxGlose: currentCompany!.taxGlose,
            taxAddress: currentCompany!.taxAddress ?? "",
          }
    );
  }, [isNewRecord, currentCompany, form]);

  const handleCompanySave = async (values: CompanyFormSchemaType) => {
    values.name = toCapitalize(values.name);
    // determinar si es insert or update
    setIsPending(true);

    const company: Company = {
      ...currentCompany!,
      name: values.name,
      taxGlose: values.taxGlose,
      taxValue: values.taxValue,
      taxAddress: values.taxAddress ?? "",
    };

    const resp = await companyUpdate(
      company,
      values.imageUrl ?? []
    );

    if (resp.success) {
      if (isNewRecord) currentCompany = resp.data;
      toast.success(
        `${CompanyBusiness.metadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${CompanyBusiness.metadata.singularName}`,
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
    handleCompanySave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
  };
};
