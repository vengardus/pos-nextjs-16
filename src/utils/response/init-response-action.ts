
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";

export const initResponseAction = ():ResponseAction => {
    const resp: ResponseAction = {
        success: false,
        data: null,
        pagination: {
            currentPage: 0,
            totalPages: 0
        },
    };
    return resp
}
