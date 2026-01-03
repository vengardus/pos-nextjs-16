import 'server-only'

import prisma from "@/server/db/prisma";
import { CashRegisterStatusEnum } from "@/types/enums/cash-register-status.enum";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CashRegisterDecision } from "@/types/interfaces/cash-register/cash-register-decision.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { CashRegisterExtends } from "@/types/interfaces/cash-register/cash-register-extends.interface";
import { getActionError } from "@/utils/errors/get-action-error";

/**
 * Determina la caja activa para ventas: usa una abierta si el usuario ya tiene una,
 * o devuelve las cajas libres para su selección.
 */
export async function cashRegisterDetermineActiveCashRegister(params: {
  userId: string;
  branchId: string;
}): Promise<ResponseAction> {
  const resp = initResponseAction();

  try {
    console.log("query=>cashRegisterDetermineActiveCashRegister");
    
    // 1. Obtener cajas abiertos para la sucursal
    const openClosures = await getOpenCashRegisterClosuresByBranch({ branchId: params.branchId });

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

    // 2. Sin caja abierta: preparar IDs para filtrar libres
    const openedIds = openClosures.map((c) => c.CashRegister.id);
    const freeRegisters = await getFreeCashRegistersByBranch(params.branchId, openedIds);

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

/**
 Devuelve las cajas aperturadas en una sucursal
 */
async function getOpenCashRegisterClosuresByBranch(params: { branchId: string }) {
  return await prisma.cashRegisterClosureModel.findMany({
    where: {
      CashRegister: {
        is: {
          branchId: params.branchId,
        },
      },
      status: CashRegisterStatusEnum.OPENING,
    },
    select: {
      id: true,
      userId: true,
      CashRegister: {
        select: {
          id: true,
          description: true,
          Branch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Devuelve las cajas libres en una sucursal dado un listado de IDs ya abiertas
 */
async function getFreeCashRegistersByBranch(branchId: string, openedIds: string[]) {
  const allRegisters = await prisma.cashRegisterModel.findMany({
    where: { branchId },
    select: {
      id: true,
      description: true,
      Branch: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return allRegisters.filter((cr) => !openedIds.includes(cr.id));
}
