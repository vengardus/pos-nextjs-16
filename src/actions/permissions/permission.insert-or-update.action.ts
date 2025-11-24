"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Permission } from "@/types/interfaces/permission/permission.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

// Configuration Cloudinary

export const permissionInsertOrUpdate = async (
  permission: Permission,
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, ...rest } = permission;

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let proccesPermission: Permission = permission;

      // Determinar si es create or update
      if (id) {
        // Update
        proccesPermission = await prisma.permissionModel.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        });
      } else {
        // create
        proccesPermission = await prisma.permissionModel.create({
          data: {
            ...rest,
          },
        });
      }

      return {
        proccesPermission,
      };
    });
    resp.data = prismaTx.proccesPermission;
    resp.success = true;

    console.log("updateTag: ", `permissions-${prismaTx.proccesPermission.companyId}`)

    updateTag(`permissions-${prismaTx.proccesPermission.companyId}`, );
    revalidatePath("/config/permissions");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

