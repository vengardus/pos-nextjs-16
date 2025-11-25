import 'server-only'

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const categoryGetAll = async (): Promise<ResponseAction> => {
    const resp = initResponseAction();

    try {
        console
        const data = await prisma.categoryModel.findMany()  
        resp.data = data as Category[]
        resp.success = true  
    } catch (error) {
        resp.message = getActionError(error);
    }
    return resp
}