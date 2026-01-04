import 'server-only'

import prisma from "@/server/db/prisma";
import type { Branch } from "../domain/branch.types";

export const branchGetAllRepository = async (
  companyId: string
): Promise<Branch[]> => {
  if (!companyId) throw new Error("Company id is required");
  
  const data = await prisma.branchModel.findMany({
    where: {
      companyId,
    },
    include: {
      CashRegister: {
        select: {
          id: true,
          description: true,
          isDefault: true,
          branchId: true
        },
        orderBy: {
          description: "asc"
        }
      }
    }
  });

  return data as Branch[];
};
