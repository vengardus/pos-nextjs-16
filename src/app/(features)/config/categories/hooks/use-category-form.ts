import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Category } from "@/types/interfaces/category/category.interface";
import {
  CategoryFormSchema,
  CategoryFormSchemaType,
} from "@/app/(features)/config/categories/schemas/category-form.schema";
import { categoryInsertOrUpdateAction } from "@/server/category/next/actions/category.insert-or-update.action";
import type { CategoryInput } from "@/server/category/domain/category.input.schema";
import { getModelMetadata } from "@/server/common/model-metadata";

const defaultValues: CategoryFormSchemaType = {
  name: "",
  color: "",
  imageFiles: undefined,
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
  const categoryMetadata = getModelMetadata("category");

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
            imageFiles: undefined,
          }
    );
  }, [isNewRecord, currentCategory, form]);

  const handleSave = async (values: CategoryFormSchemaType) => {
    // determinar si es insert or update
    setIsPending(true);

    const categoryInput: CategoryInput = {
      ...(isNewRecord ? {} : { id: currentCategory?.id }),
      name: values.name,
      color: values.color,
      companyId,
      isDefault: currentCategory?.isDefault ?? false,
    };

    const formData = new FormData();
    formData.append("category", JSON.stringify(categoryInput));

    const files =
      values.imageFiles instanceof FileList
        ? Array.from(values.imageFiles)
        : Array.isArray(values.imageFiles)
          ? values.imageFiles
          : [];

    files.forEach((file) => {
      formData.append("images", file);
    });

    const resp = await categoryInsertOrUpdateAction(formData);

    if (resp.success) {
      if (isNewRecord) currentCategory = resp.data;
      toast.success(
        `${categoryMetadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${categoryMetadata.singularName}`,
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
