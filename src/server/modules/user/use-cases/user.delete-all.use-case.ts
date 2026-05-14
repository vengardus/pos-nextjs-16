import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userDeleteAllRepository } from "../repository/user.delete-all.repository";
import { auditLogCreateRepository } from "../../audit-log/repository/audit-log.create.repository";

export const userDeleteAllUseCase = async (): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const users = await userDeleteAllRepository();

    await auditLogCreateRepository({
      action: "DELETE_ALL_USERS",
      entity: "User",
      details: { count: users.count, status: "SUCCESS" },
      userId: "SYSTEM",
    });

    resp.data = users;
    resp.success = true;
  } catch (error) {
    const errorMessage = getActionError(error);

    await auditLogCreateRepository({
      action: "DELETE_ALL_USERS",
      entity: "User",
      details: { status: "FAILED", error: errorMessage },
      userId: "SYSTEM",
    });

    resp.message = errorMessage;
  }

  return resp;
};
