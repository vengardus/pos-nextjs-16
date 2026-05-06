import "server-only";

import prisma from "@/server/db/prisma";
import type { AuthorizedProviderEmailInput } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.input.schema";

export const authorizedProviderEmailUpsertRepository = async (
  payload: AuthorizedProviderEmailInput
) => {
  const { id, ...data } = payload;

  if (id) {
    return prisma.authorizedProviderEmailModel.update({
      where: { id },
      data,
    });
  }

  return prisma.authorizedProviderEmailModel.upsert({
    where: { email: data.email },
    update: data,
    create: data,
  });
};
