import "server-only";

import prisma from "@/server/db/prisma";
import type { AuthorizedProviderEmailInput } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.input.schema";

export const authorizedProviderEmailUpsertRepository = async (
  payload: AuthorizedProviderEmailInput
) => {
  const { id, ...data } = payload;
  const normalizedData = {
    email: data.email,
    clientName: data.clientName,
    expirationDate: data.expirationDate,
    isActive: data.isActive,
    isSuperAdmin: data.isSuperAdmin,
  };

  if (id) {
    return prisma.authorizedProviderEmailModel.update({
      where: { id },
      data: normalizedData,
    });
  }

  return prisma.authorizedProviderEmailModel.upsert({
    where: { email: normalizedData.email },
    update: normalizedData,
    create: normalizedData,
  });
};
