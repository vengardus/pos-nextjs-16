import "server-only";
import { prisma } from "@/server/db/prisma";

export const demoPolicyGetRepository = async () => {
  return await prisma.demoPolicyModel.findFirst();
};
