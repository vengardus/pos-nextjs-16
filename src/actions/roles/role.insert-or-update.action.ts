"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Role } from "@/types/interfaces/role/role.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const roleInsertOrUpdate = async (
  role: Role,
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, isDefault, Company, Permission, ...rest } = role;

  try {
    if (Permission?.length === 0) {
      throw new Error("Debe seleccionar al menos un permiso");
    }

    const prismaTx = await prisma.$transaction(async (tx) => {
      let proccesRole: Role = role;

      // eliminar permisos si es update
      if (id) {
        await tx.permissionModel.deleteMany({
          where: {
            roleId: id,
          },
        });
      }

      // Determinar si es create or update
      if (id) {
        // Update
        proccesRole = await tx.roleModel.update({
          where: {
            id,
          },
          data: {
            ...rest,
            Permission: {
              createMany: {
                data: Permission!.map((permission) => {
                  return {
                    moduleCod: permission.moduleCod,
                    companyId: companyId,
                    roleCod: role.cod,
                  };
                }),
              },
            },
          },
        });
      } else {
        // create
        proccesRole = await tx.roleModel.create({
          data: {
            ...rest,
            companyId,
            Permission: {
              createMany: {
                data: Permission!.map((permission) => {
                  return {
                    moduleCod: permission.moduleCod,
                    companyId: companyId,
                    roleCod: role.cod,
                  };
                }),
              },
            },
          },
        });
      }

      return {
        proccesRole,
      };
    });
    resp.data = prismaTx.proccesRole;
    resp.success = true;

    revalidatePath("/config/roles");
    updateTag(`roles-${companyId}`);
    updateTag(`permissions-${role.id}`);
    updateTag(`permissions-${companyId}-${role.cod}`);
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
