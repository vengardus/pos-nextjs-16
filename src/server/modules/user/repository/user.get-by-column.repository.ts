import "server-only";

import prisma from "@/server/db/prisma";
import type { User } from "@/server/modules/user/domain/user.interface";

export const userGetByColumnRepository = async (
  column: string,
  value: string
): Promise<User | null> => {
  console.log("Action:", { column, value });
  return await prisma.userModel.findFirst({
    where: {
      [column]: value,
    },
  });
};
