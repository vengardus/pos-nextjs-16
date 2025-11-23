"use server"

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const userDeleteAll = async (): Promise<ResponseAction> => {
    const resp = initResponseAction();

    try {
        const users = await prisma.userModel.deleteMany()  
        resp.data = users
        resp.success = true  
    } catch (error) {
        resp.message = getActionError(error);
    }
    return resp
}