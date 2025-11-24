"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { Prisma } from "@prisma/client";
import { UserRole } from "@/types/enums/user-role.enum";
import type { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";
import type { BranchUser } from "@/types/interfaces/branch-user/branch-user.interface";
import bcrypt from "bcryptjs";
import { AppConstants } from "@/constants/app.constants";
import { authGetSession } from "@/actions/auth/auth.get-session.action";

export const userInsertOrUpdate = async (
  user: UserWithRelations,
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    // 0. Verificación de sesión
    const respSession = await authGetSession();
    if (!respSession.data.isAuthenticated) throw new Error("Usuario no autenticado.");

    const userId = respSession.data.sessionUser.id;
    if (!userId) throw new Error("No hay sesión de usuario.");

    // Iniciar transacción
    console.log("User::", user);
    const prismaTx = await prisma.$transaction(async (tx) => {
      return {
        proccesUser: await processUserData(tx, user),
      };
    });

    resp.data = prismaTx.proccesUser;
    resp.success = true;

    console.log("Revalidate users", `users-${companyId}`);
    updateTag(`users-${companyId}`);
    revalidatePath("/config/users");
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};

// Función auxiliar para procesar usuario y datos relacionados
const processUserData = async (prismaTx: Prisma.TransactionClient, user: UserWithRelations) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    id,
    authType,
    authId,
    BranchUser,
    Company,
    CashRegisterMovement,
    Sale,
    password,
    ...rest
  } = user;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const branchId = user.BranchUser?.[0].branchId ?? "";
  const cashRegisterId = user.BranchUser?.[0].cashRegisterId ?? "";
  if (!branchId || !cashRegisterId) {
    throw new Error("Branch id and CashRegister id are required");
  }

  let userModel;
  // encryt password
  let hashedPassword;

  if (id) {
    // encryt password
    hashedPassword =
      password.length && password !== AppConstants.DEFAULT_VALUES.messageUserPassword
        ? await bcrypt.hash(password, 10)
        : "";
    console.log("hashedPassword:", hashedPassword);

    // Actualizar usuario existente
    userModel = await prismaTx.userModel.update({
      where: { id },
      data: {
        ...rest,
        ...(hashedPassword && hashedPassword !== "" ? { password: hashedPassword } : {}),
        documentTypeId: rest.documentTypeId as string,
        roleId: rest.roleId, //as UserRoleEnum
      },
    });
    console.log("update", id, rest, branchId, cashRegisterId, userModel);
    const updatedBranchUser = await prismaTx.branchUserModel.updateMany({
      where: {
        userId: id, // Filtra por el usuario (asume que el usuario solo está asociado a una sucursal)
      },
      data: {
        branchId: branchId,
        cashRegisterId: cashRegisterId,
      },
    });
    console.log("updatedBranchUser", updatedBranchUser);
  } else {
    // encryt password
    hashedPassword = await bcrypt.hash(password, 10);
    // Crear nuevo usuario
    console.log("create", rest, branchId, cashRegisterId, typeof cashRegisterId);
    const newUser = await prismaTx.userModel.create({
      data: {
        ...rest,
        password: hashedPassword,
        documentTypeId: rest.documentTypeId as string,
        roleId: rest.roleId, //as UserRoleEnum,
        BranchUser: {
          createMany: {
            data: [
              {
                branchId: branchId,
                cashRegisterId: cashRegisterId,
              } as BranchUser,
            ],
          },
        },
      },
    });

    userModel = await prismaTx.userModel.update({
      where: { id: newUser.id },
      data: {
        authId: newUser.id,
      },
    });

    // Insertar en otras tablas relacionadas
    // await prismaTx.branchUserModel.create({
    //   data: {
    //     userId: userModel.id,
    //     branchId: "branch-default-id", // Reemplazar con lógica real
    //     role: "MEMBER",
    //   },
    // });

    // Insertar en más tablas si es necesario...
  }

  // Convertir roleId a UserRole
  const { roleId, ...restUser } = userModel;
  return {
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
};
