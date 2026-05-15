import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userDeleteAllRepository } from "../repository/user.delete-all.repository";
import { auditLogCreateRepository } from "../../audit-log/repository/audit-log.create.repository";
import { AUDIT_ACTIONS, AUDIT_SYSTEM_USER } from "../../audit-log/constants/audit-log.constants";

export const userDeleteAllUseCase = async (): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const users = await userDeleteAllRepository();

    await auditLogCreateRepository({
      action: AUDIT_ACTIONS.DELETE_ALL_USERS,
      entity: "User",
      details: { count: users.count, status: "SUCCESS" },
      userId: AUDIT_SYSTEM_USER,
    });

    resp.data = users;
    resp.success = true;
  } catch (error) {
    const errorMessage = getActionError(error);

    await auditLogCreateRepository({
      action: AUDIT_ACTIONS.DELETE_ALL_USERS,
      entity: "User",
      details: { status: "FAILED", error: errorMessage },
      userId: AUDIT_SYSTEM_USER,
    });

    resp.message = errorMessage;
  }

  return resp;
};
