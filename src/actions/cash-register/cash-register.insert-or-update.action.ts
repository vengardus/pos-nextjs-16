"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { authGetSession } from "@/lib/data/auth/auth.get-session";

// Configuration Cloudinary

export const cashRegisterInsertOrUpdate = async (
  cashRegister: CashRegister,
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id,...rest } = cashRegister;

  console.log(rest)
  
  try {
    // 0. authenticated check
    const respSession = await authGetSession();
    if (!respSession.data.isAuthenticated)
      throw new Error("Usuario no autenticado.");
    const userId = respSession.data.sessionUser.id;
    if (!userId) throw new Error("No hay sesión de usuario.");

    // 1. obtener company (para formar key de updateTag)
    console.log("cashRegister.branchId", cashRegister.branchId)
    const branch = await prisma.branchModel.findUnique({
      where: {
        id: cashRegister.branchId,
      },
    })
    if (!branch) throw new Error("Sucursal no encontrada.")

    const prismaTx = await prisma.$transaction(async () => {
      let proccesCashRegister: CashRegister = cashRegister;

      // Determinar si es create or update
      if (id) {
        // Update
        proccesCashRegister = await prisma.cashRegisterModel.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        });
      } else {
        // create
        proccesCashRegister = await prisma.cashRegisterModel.create({
          data: {
            ...rest,
          },
        });
      }

      return {
        proccesCashRegister,
      };
    });
    resp.data = prismaTx.proccesCashRegister;
    resp.success = true;

    revalidatePath("/config/branches");
    updateTag("branches");
    updateTag("branch-user");
    updateTag(`cash-register-${branch.companyId}`);
    console.log("=>REVALIDATE", `cash-register-${branch.companyId}`);
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
