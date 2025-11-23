"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";

export const userGetAllByCompany = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    const users = await prisma.userModel.findMany({
      where: {
        BranchUser: {
          some: {
            Branch: {
              companyId: companyId, // Filtrar por compañía
            },
          },
        },
      },
      include: {
        BranchUser: {
          include: {
            Branch: true, // Opcional: incluir info de la sucursal
          },
        },
      },
    });
    console.log("==>users/get-all-by-company:");
    resp.data = users as UserWithRelations[];
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
