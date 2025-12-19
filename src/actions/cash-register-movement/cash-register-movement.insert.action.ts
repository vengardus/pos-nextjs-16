"use server";

//import { revalidatePath } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CashRegisterMovement } from "@/types/interfaces/cash-register-movement/cash-register-movement.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { updateTag } from "next/cache";
import { authGetSession } from "@/lib/data/auth/auth.get-session";

export const cashRegisterMovementInsert = async (
  cashRegisterMovement: CashRegisterMovement
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  //console.log("convertServerDateToLocal", convertServerDateToLocal(new Date()))

  // 0.1 authenticated check
  const respSession = await authGetSession();
  if (!respSession.data.isAuthenticated)
    throw new Error("Usuario no autenticado.");
  const userid = respSession.data.sessionUser.id;
  if (!userid) throw new Error("No hay sesión de usuario.");

  // 0.2 validate
  if (!cashRegisterMovement.cashRegisterClosureId)
    throw new Error("cashRegisterClosureId es requerido.");
  if (!cashRegisterMovement.paymentMethodId)
    throw new Error("paymentMethodId es requerido.");
  if (!cashRegisterMovement.movementCategory)
    throw new Error("movementCategory es requerido.");
  if (!cashRegisterMovement.paymentMethodCod)
    throw new Error("paymentMethodCode es requerido.");
  if (!cashRegisterMovement.movementType)
    throw new Error("movementType es requerido.");
  if (cashRegisterMovement.amount < 0.01)
    throw new Error("amount es requerido.");

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      const proccesCashRegisterMovement =
        await tx.cashRegisterMovementModel.create({
          data: {
            ...cashRegisterMovement,
            userId: userid,
          },
        });

      return {
        proccesCashRegisterMovement,
      };
    });
    resp.data = prismaTx.proccesCashRegisterMovement;
    resp.success = true;

    // revalidates
    updateTag("cash-register-movements");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
