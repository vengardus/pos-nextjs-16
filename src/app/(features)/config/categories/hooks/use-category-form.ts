import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Category } from "@/types/interfaces/category/category.interface";
import { CategoryBusiness } from "@/business/category.business";
import {
  CategoryFormSchema,
  CategoryFormSchemaType,
} from "@/app/(features)/config/categories/schemas/category-form.schema";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { categoryInsertOrUpdateAction } from "@/actions/categories/category.insert-or-update.action";

const defaultValues: CategoryFormSchemaType = {
  name: "",
  color: "",
  imageUrl: undefined,
};

interface CategoryFormProps {
  currentCategory: Category | null;
  companyId: string;
}
export const useCategoryForm = ({
  currentCategory,
  companyId,
}: CategoryFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const isNewRecord = !currentCategory;

  const form = useForm<CategoryFormSchemaType>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            name: currentCategory!.name,
            color: currentCategory!.color,
          }
    );
  }, [isNewRecord, currentCategory, form]);

  const handleSave = async (values: CategoryFormSchemaType) => {
    values.name = toCapitalize(values.name);
    // determinar si es insert or update
    setIsPending(true);

    const category: Category = isNewRecord
      ? {
          id: "",
          name: values.name,
          color: values.color,
          companyId: companyId,
          isDefault: false,
          createdAt: new Date(),
          imageUrl: null,
          updatedAt: null
        }
      : {
          ...currentCategory!,
          name: values.name,
          color: values.color,
          updatedAt: new Date(),
          imageUrl: null
        };

    const resp = await categoryInsertOrUpdateAction(
      category,
      values.imageUrl ?? []
    );

    if (resp.success) {
      if (isNewRecord) currentCategory = resp.data;
      toast.success(
        `${CategoryBusiness.metadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${CategoryBusiness.metadata.singularName}`,
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
