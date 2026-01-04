"use server";

import { updateTag } from "next/cache";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CashRegisterMovement } from "@/types/interfaces/cash-register-movement/cash-register-movement.interface";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { cashRegisterMovementInsertUseCase } from "@/server/modules/cash-register-movement/use-cases/cash-register-movement.insert.use-case";

export const cashRegisterMovementInsertAction = async (
  cashRegisterMovement: CashRegisterMovement
): Promise<ResponseAction> => {
  const respSession = await authGetSessionUseCase();
  if (!respSession.data.isAuthenticated) {
    throw new Error("Usuario no autenticado.");
  }
  const userId = respSession.data.sessionUser.id;
  if (!userId) throw new Error("No hay sesión de usuario.");

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
  if (cashRegisterMovement.amount < 0.01) throw new Error("amount es requerido.");

  const resp = await cashRegisterMovementInsertUseCase(cashRegisterMovement, userId);

  if (resp.success) {
    updateTag(`cash-register-movements-totals-${cashRegisterMovement.cashRegisterClosureId}`);
    updateTag("cash-register-movements");
  }

  return resp;
};
