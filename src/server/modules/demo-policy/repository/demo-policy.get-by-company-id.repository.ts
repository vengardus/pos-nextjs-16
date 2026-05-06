import "server-only";

import prisma from "@/server/db/prisma";

export const demoPolicyGetByCompanyIdRepository = async (companyId: string) => {
  return prisma.demoPolicyModel.findUnique({
    where: { companyId },
    select: {
      id: true,
      companyId: true,
      authorizedProviderEmailId: true,
      isEnabled: true,
      maxUsers: true,
      maxRecordsPerEntity: true,
      maxGuestSignupsPerIpPerDay: true,
      guestTtlDays: true,
      allowCsvImportForGuest: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
