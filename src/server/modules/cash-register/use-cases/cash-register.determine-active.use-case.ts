import 'server-only'

import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { CashRegisterDecision, CashRegisterExtends } from "../domain/cash-register.types";
import { cashRegisterGetOpenClosuresByBranchRepository } from "../repository/cash-register.get-open-closures-by-branch.repository";
import { cashRegisterGetFreeByBranchRepository } from "../repository/cash-register.get-free-by-branch.repository";

import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";

/**
 * Determina la caja activa para ventas: usa una abierta si el usuario ya tiene una,
 * o devuelve las cajas libres para su selección.
 */
export async function cashRegisterDetermineActiveUseCase(params: {
  userId: string;
  branchId: string;
  userRole: string;
}): Promise<ResponseAction> {
  const resp = initResponseAction();

  try {
    console.log("use-case=>cashRegisterDetermineActiveUseCase");
    
    // 1. Obtener cajas abiertos para la sucursal
    const openClosures = await cashRegisterGetOpenClosuresByBranchRepository({ branchId: params.branchId });

    // 1.2 ¿El usuario ya tiene una caja abierta?
    const userClosure = openClosures.find((c) => c.userId === params.userId);
    if (userClosure) {
      resp.success = true;
      resp.data = {
        type: "existing",
        cashRegisterClosureId: userClosure.id,
        cashRegisters: [
          {
            id: userClosure.CashRegister.id,
            description: userClosure.CashRegister.description,
            branchId: userClosure.CashRegister.Branch.id,
            branchName: userClosure.CashRegister.Branch.name,
          },
        ],
      } as CashRegisterDecision;
      return resp;
    }

    // 1.3 Si es GUEST y hay alguna caja abierta, permitir unirse (demo)
    if (params.userRole === UserRole.GUEST && openClosures.length > 0) {
        resp.success = true;
        resp.data = {
          type: "existing",
          cashRegisterClosureId: openClosures[0].id,
          cashRegisters: [
            {
              id: openClosures[0].CashRegister.id,
              description: openClosures[0].CashRegister.description,
              branchId: openClosures[0].CashRegister.Branch.id,
              branchName: openClosures[0].CashRegister.Branch.name,
            },
          ],
        } as CashRegisterDecision;
        return resp;
    }

    // 2. Sin caja abierta: preparar IDs para filtrar libres
    const openedIds = openClosures.map((c) => c.CashRegister.id);
    const freeRegisters = await cashRegisterGetFreeByBranchRepository(params.branchId, openedIds);

    resp.success = true;
    resp.data = {
      type: "selection",
      cashRegisters: freeRegisters.map(
        (cr) =>
          ({
            id: cr.id,
            description: cr.description,
            branchId: cr.Branch.id,
            branchName: cr.Branch.name,
          } as CashRegisterExtends)
      ),
    } as CashRegisterDecision;
  } catch (error) {
    resp.message = getActionError(error);
  }
  
  return resp;
}
