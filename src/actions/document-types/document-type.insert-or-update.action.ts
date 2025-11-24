"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { authGetSession } from "@/actions/auth/auth.get-session.action";

// Configuration Cloudinary

export const documentTypeInsertOrUpdate = async (
  branch: Branch,
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, CashRegister,...rest } = branch;

  console.log(rest)
  
  try {
    // 0. authenticated check
    const respSession = await authGetSession();
    if (!respSession.data.isAuthenticated)
      throw new Error("Usuario no autenticado.");
    const userId = respSession.data.sessionUser.id;
    if (!userId) throw new Error("No hay sesión de usuario.");

    const prismaTx = await prisma.$transaction(async () => {
      let proccesBranch: Branch = branch;

      // Determinar si es create or update
      if (id) {
        // Update
        proccesBranch = await prisma.branchModel.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        });
      } else {
        // create
        proccesBranch = await prisma.branchModel.create({
          data: {
            ...rest,
            BranchUser: {
              createMany: {
                data: [
                  {
                    userId
                  }
                ]
              }
            }
          },
        });
      }

      return {
        proccesBranch,
      };
    });
    resp.data = prismaTx.proccesBranch;
    resp.success = true;

    revalidatePath("/config/branchs");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

