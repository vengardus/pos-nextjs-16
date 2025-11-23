"use server"

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const userGetAllWithRelations = async (): Promise<ResponseAction> => {
    const resp = initResponseAction();

    try {
        const users = await prisma.userModel.findMany(
            {
                include: {
                    Company: true,
                    Sale: {
                        include: {
                            SaleDetail: {
                                include: {
                                    Product: true
                                }
                            },
                            CashRegisterMovement: true
                        },
                        orderBy: {
                            createdAt: "desc",
                        }
                    },
                },
                orderBy: {
                    createdAt: "desc",
                }
            }
        )  
        resp.data = users 
        resp.success = true  
    } catch (error) {
        resp.message = getActionError(error);
    }
    return resp
}