import "server-only";

import prisma from "@/server/db/prisma";
import type { BranchUser } from "@/server/modules/branch-user/domain/branch-user.interface";
import type { User } from "@/server/modules/user/domain/user.interface";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";

export const userInsertOrUpdateRepository = async (
  user: UserWithRelations,
  hashedPassword: string,
  branchId: string,
  cashRegisterId: string
): Promise<User> => {
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

  return await prisma.$transaction(async (tx) => {
    let userModel;

    if (id) {
      userModel = await tx.userModel.update({
        where: { id },
        data: {
          ...rest,
          ...(hashedPassword ? { password: hashedPassword } : {}),
          documentTypeId: rest.documentTypeId as string,
          roleId: rest.roleId,
        },
      });
      console.log("update", id, rest, branchId, cashRegisterId, userModel);

      const updatedBranchUser = await tx.branchUserModel.updateMany({
        where: {
          userId: id,
        },
        data: {
          branchId: branchId,
          cashRegisterId: cashRegisterId,
        },
      });
      console.log("updatedBranchUser", updatedBranchUser);

      return userModel;
    }

    console.log("create", rest, branchId, cashRegisterId, typeof cashRegisterId);
    const newUser = await tx.userModel.create({
      data: {
        ...rest,
        password: hashedPassword,
        documentTypeId: rest.documentTypeId as string,
        roleId: rest.roleId,
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

    const updatedUser = await tx.userModel.update({
      where: { id: newUser.id },
      data: {
        authId: newUser.id,
      },
    });

    return updatedUser;
  });
};
