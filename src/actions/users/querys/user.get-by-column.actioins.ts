"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const userGetByColumn = async (
  column: string,
  value: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  console.log('Action:',{ column, value });
  try {
    const obj = await prisma.userModel.findFirst({
      where: {
        [column]: value,
      },
    });
    resp.data = obj;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
