import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { branchUserGetAllByUserRepository } from "../repository/branch-user.get-all-by-user.repository";

export const branchUserGetAllByUserUseCase = async (
  userId: string,
  page?: number,
  pageSize?: number,
  search?: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!userId) throw new Error("ID de usuario es requerido");

    const { data, total } = await branchUserGetAllByUserRepository(
      userId,
      page,
      pageSize,
      search
    );

    resp.data = data;
    resp.success = true;

    if (page !== undefined && pageSize !== undefined) {
      resp.pagination = {
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      };
    }
    console.log("query=>branchUserGetAllByUser");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
