import "server-only";

import bcrypt from "bcryptjs";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { UserRole } from "@/types/enums/user-role.enum";
import { AppConstants } from "@/shared/constants/app.constants";
import { authGetSession } from "@/lib/data/auth/auth.get-session";
import { userInsertOrUpdateRepository } from "../repository/user.insert-or-update.repository";

export const userInsertOrUpdateUseCase = async (
  user: UserWithRelations
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const respSession = await authGetSession();
    if (!respSession.data.isAuthenticated) {
      throw new Error("Usuario no autenticado.");
    }

    const userId = respSession.data.sessionUser.id;
    if (!userId) throw new Error("No hay sesión de usuario.");

    console.log("User::", user);

    const branchId = user.BranchUser?.[0].branchId ?? "";
    const cashRegisterId = user.BranchUser?.[0].cashRegisterId ?? "";
    if (!branchId || !cashRegisterId) {
      throw new Error("Branch id and CashRegister id are required");
    }

    let hashedPassword = "";

    if (user.id) {
      hashedPassword =
        user.password.length &&
        user.password !== AppConstants.DEFAULT_VALUES.messageUserPassword
          ? await bcrypt.hash(user.password, 10)
          : "";
      console.log("hashedPassword:", hashedPassword);
    } else {
      hashedPassword = await bcrypt.hash(user.password, 10);
    }

    const userModel = await userInsertOrUpdateRepository(
      user,
      hashedPassword,
      branchId,
      cashRegisterId
    );

    const { roleId, ...restUser } = userModel;
    resp.data = {
      ...restUser,
      roleId: roleId as UserRole,
      BranchUser: [
        {
          userId: userModel.id,
          branchId: branchId,
          cashRegisterId: cashRegisterId,
        },
      ],
    };
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
