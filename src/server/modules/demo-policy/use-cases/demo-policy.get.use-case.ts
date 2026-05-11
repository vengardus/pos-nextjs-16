import "server-only";
import { prisma } from "@/server/db/prisma";
import { initResponseAction } from "@/utils/response/init-response-action";

export const demoPolicyGetUseCase = async () => {
    const resp = initResponseAction();
    const policy = await prisma.demoPolicyModel.findFirst();
    if (!policy) {
        resp.message = "Política no encontrada";
        return resp;
    }
    resp.success = true;
    resp.data = policy;
    return resp;
};
