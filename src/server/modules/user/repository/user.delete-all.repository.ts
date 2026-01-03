import "server-only";

import prisma from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";

export const userDeleteAllRepository = async (): Promise<Prisma.BatchPayload> => {
  return await prisma.userModel.deleteMany();
};
