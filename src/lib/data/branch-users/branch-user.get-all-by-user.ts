import 'server-only'

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const branchUserGetAllByUser = async (userId: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!userId) throw new Error("User id is required");

    const data = await prisma.branchUserModel.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        branchId: true,
        Branch: {
          select: {
            id: true,
            name: true,
            taxAddress: true,
            isDefault: true,
            companyId: true,
            CashRegister: {
              select: {
                id: true,
                description: true,
                isDefault: true,
              },
              orderBy: [
                {
                  isDefault: "desc",
                },
                {
                  description: "asc",
                },
              ],
            },
          },
        },
      },
      orderBy: [
        {
          Branch: {
            isDefault: "desc", // Primero los isDefault = true
          },
        },
        {
          Branch: {
            name: "asc", // Luego ordena por name en orden alfabético
          },
        },
      ],
    });

    resp.data = data;
    resp.success = true;
    console.log("=>branch-users/get-all-by-user");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
