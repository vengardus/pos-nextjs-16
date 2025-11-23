import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { Role } from "@/types/interfaces/role/role.interface";
import { RoleFormSchema, RoleFormSchemaType } from "@/app/(features)/config/roles/schemas/role-form.schema";
import { RoleBusiness } from "@/business/role.business";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { useModuleStore } from "@/stores/module/module.store";
import { usePermissionStore } from "@/stores/permission/permission.store";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { roleInsertOrUpdate } from "@/actions/roles/mutatiuons/role.insert-or-update.action";
import { permissionGetAllByRoleCached } from "@/actions/permissions/cache/permission.cache";

const defaultValues: RoleFormSchemaType = {
  description: "",
  cod: "",
  isDefault: false,
};

interface UserFormProps<T extends Role> {
  currentRow: T | null;
  companyId: string;
}
export const useRoleForm = <T extends Role>({
  currentRow,
  companyId,
}: UserFormProps<T>) => {
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const isNewRecord = !currentRow;
  const modules = useModuleStore((state) => state.modules);
  const permissions = usePermissionStore((state) => state.permissions);
  const setPermissions = usePermissionStore((state) => state.setPermissions);

  const form = useForm<RoleFormSchemaType>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            description: currentRow!.description,
            cod: currentRow!.cod,
            isDefault: currentRow!.isDefault,
          }
    );
  }, [isNewRecord, currentRow, form]);

  useEffect(() => {
    if (!currentRow) {
      setPermissions([]);
      return;
    }
    const getPermissions = async () => {
      setIsLoading(true);
      const respPermissions = await permissionGetAllByRoleCached(currentRow!.id);
      console.log("respPermissions!!!!!!!", respPermissions);
      if (!respPermissions.success)
        setMessageGeneralError(respPermissions.message + "ERROR");
      setPermissions(respPermissions.data);
      setIsLoading(false);
    };

    getPermissions();
  }, [isNewRecord, currentRow, setPermissions]);

  const validate = (): ResponseAction => {
    console.log("permissions!!!", permissions);
    const resp = initResponseAction();
    if (!permissions.length) resp.message = "Debe definir permisos";
    else resp.success = true;
    return resp;
  };

  const handleSave = async (values: Role): Promise<ResponseAction> => {
    const respValidate = validate();
    if (!respValidate.success) return respValidate;

    values.description = toCapitalize(values.description);
    // determinar si es insert or update
    setIsPending(true);

    const role: Role = isNewRecord
      ? {
          id: "",
          description: values.description,
          cod: values.cod,
        }
      : {
          ...currentRow!,
          description: values.description,
          cod: values.cod,
        };
    
    role.Permission = permissions;

    const resp = await roleInsertOrUpdate(role, companyId);

    if (resp.success) {
      if (isNewRecord) currentRow = resp.data;
      toast.success(
        `${RoleBusiness.metadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${RoleBusiness.metadata.singularName}`,
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
    modules,
    permissions,
    isLoading,
  };
};
