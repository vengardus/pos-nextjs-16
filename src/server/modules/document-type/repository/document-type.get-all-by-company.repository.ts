import "server-only";

import prisma from "@/server/db/prisma";
import type { DocumentType } from "@/types/interfaces/document-type/document-type.interface";

export const documentTypeGetAllByCompanyRepository = async (
  companyId: string
): Promise<DocumentType[]> => {
  return await prisma.documentTypeModel.findMany({
    where: {
      companyId,
    },
  });
};
