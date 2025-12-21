import "server-only";

import prisma from "@/server/db/prisma";
import type { User } from "@/types/interfaces/user/user.interface";

export const userDeleteByIdRepository = async (id: string): Promise<User> => {
  return await prisma.userModel.delete({
    where: {
      id,
    },
  });
};
