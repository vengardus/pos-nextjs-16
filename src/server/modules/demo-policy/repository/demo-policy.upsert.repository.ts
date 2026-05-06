import "server-only";

import prisma from "@/server/db/prisma";
import type { DemoPolicyInput } from "@/server/modules/demo-policy/domain/demo-policy.input.schema";

export const demoPolicyUpsertRepository = async (payload: DemoPolicyInput) => {
  const { companyId, ...data } = payload;

  return prisma.demoPolicyModel.upsert({
    where: { companyId },
    create: {
      companyId,
      ...data,
    },
    update: {
      ...data,
    },
  });
};
