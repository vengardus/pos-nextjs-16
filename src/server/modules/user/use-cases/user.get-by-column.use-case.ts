import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { User } from "@/server/modules/user/domain/user.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userGetByColumnRepository } from "../repository/user.get-by-column.repository";

export const userGetByColumnUseCase = async (
  column: string,
  value: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    if (!column || !value) throw new Error("Column and value are required");
    const obj = await userGetByColumnRepository(column, value);
    resp.data = obj as User | null;
    resp.success = true;
    console.log("query=>userGetByColumn");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
