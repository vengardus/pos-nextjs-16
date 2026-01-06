import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userGetAllWithRelationsRepository } from "../repository/user.get-all-with-relations.repository";

export const userGetAllWithRelationsUseCase = async (): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const users = await userGetAllWithRelationsRepository();
    resp.data = users as UserWithRelations[];
    resp.success = true;
    console.log("query=>userGetAllWithRelations");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
