import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { authGetSession } from "@/lib/data/auth/auth.get-session";
import { cashRegisterInsertOrUpdateRepository } from "../repository/cash-register.insert-or-update.repository";
import { cashRegisterGetBranchByIdRepository } from "../repository/cash-register.get-branch-by-id.repository";

export const cashRegisterInsertOrUpdateUseCase = async (
  cashRegister: CashRegister
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const respSession = await authGetSession();
    if (!respSession.data.isAuthenticated)
      throw new Error("Usuario no autenticado.");
    const userId = respSession.data.sessionUser.id;
    if (!userId) throw new Error("No hay sesión de usuario.");

    const branch = await cashRegisterGetBranchByIdRepository(
      cashRegister.branchId
    );
    if (!branch) throw new Error("Sucursal no encontrada.");

    const proccesCashRegister = await cashRegisterInsertOrUpdateRepository(
      cashRegister
    );

    resp.data = {
      cashRegister: proccesCashRegister,
      companyId: branch.companyId,
    };
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
