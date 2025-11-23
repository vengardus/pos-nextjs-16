import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { UserRole } from "@/types/enums/user-role.enum";
import type { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";
import type { BranchUser } from "@/types/interfaces/branch-user/branch-user.interface";
import { UserBusiness } from "@/business/user.business";
import { UserFormSchema, UserFormSchemaType } from "@/app/(features)/config/users/schemas/user-form.schema";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { useBranchStore } from "@/stores/branch/branch.store";
import { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";
import { useRoleStore } from "@/stores/role/role.store";
import { RoleBusiness } from "@/business/role.business";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { AppConstants } from "@/constants/app.constants";
import { userInsertOrUpdate } from "@/actions/users/mutations/user.insert-or-update.action";

const defaultValues: UserFormSchemaType = {
  name: "",
  email: "",
  password: "",
  documentTypeId: "",
  documentNumber: "",
  phone: "",
  address: "",
  branchId: "",
  cashRegisterId: "",
  roleId: "",
};

interface UserFormProps {
  currentRow: UserWithRelations | null;
  companyId: string;
}
export const useUserForm = ({ currentRow, companyId }: UserFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
  const branches = useBranchStore((state) => state.branches);
  const roles = useRoleStore((state) => state.roles);
  const isNewRecord = !currentRow;

  const form = useForm<UserFormSchemaType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? {
            ...defaultValues,
            roleId: RoleBusiness.getRoleByCod(roles, UserRole.CASHIER)?.id?? "",
          }
        : {
            name: currentRow!.name,
            email: currentRow!.email,
            documentTypeId: currentRow!.documentTypeId ?? "",
            documentNumber: currentRow!.documentNumber ?? "",
            phone: currentRow!.phone ?? "",
            address: currentRow!.address ?? "",
            branchId: currentRow!.BranchUser
            ? currentRow!.BranchUser[0].branchId
            : "",
            cashRegisterId: currentRow!.BranchUser
            ? currentRow!.BranchUser[0]?.cashRegisterId
            : "",
            roleId: RoleBusiness.getRoleByCod(roles, currentRow!.roleId)?.id?? "",
            password: AppConstants.DEFAULT_VALUES.messageUserPassword,
          }
    );
    if (!isNewRecord) {
      const branch = branches.filter(
        (branch) =>
          branch.id ===
          (currentRow!.BranchUser ? currentRow!.BranchUser[0].branchId : "")
      );
      if (branch.length > 0) {
        setCashRegisters(branch[0].CashRegister || []);
      }
    }
  }, [isNewRecord, currentRow, form, branches, roles]);

  const handleSave = async (values: UserFormSchemaType): Promise<ResponseAction> => {
    values.name = toCapitalize(values.name);
    // determinar si es insert or update
    setIsPending(true);

    const user: UserWithRelations = isNewRecord
      ? {
          id: "",
          name: values.name,
          email: values.email,
          password: values.password,
          documentTypeId: values.documentTypeId,
          documentNumber: values.documentNumber,
          phone: values.phone,
          address: values.address,
          roleId: values.roleId as UserRole,
          authType: "credentials",
          authId: "",
          BranchUser: [
            {
              id: "",
              branchId: values.branchId,
              cashRegisterId: values.cashRegisterId,
            } as BranchUser,
          ],
        }
      : {
          ...currentRow!,
          name: values.name,
          email: values.email,
          password: values.password,
          documentTypeId: values.documentTypeId,
          documentNumber: values.documentNumber,
          phone: values.phone,
          address: values.address,
          roleId: values.roleId as UserRole,
          BranchUser: [
            {
              branchId: values.branchId,
              cashRegisterId: values.cashRegisterId,
            } as BranchUser,
          ],
        };

    // mapear roleId: debe ir role.cod)
    const role = RoleBusiness.getRoleById(roles, user.roleId)
    user.roleId = role!.cod as UserRole;


    const resp = await userInsertOrUpdate(user, companyId);

    if (resp.success) {
      if (isNewRecord) currentRow = resp.data;
      toast.success(
        `${UserBusiness.metadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${UserBusiness.metadata.singularName}`,
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
    cashRegisters,
    setCashRegisters,
    roles,
  };
};
