import 'server-only'

import prisma from "@/infrastructure/db/prisma";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const clientSupplierGetAllByCompany = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");

    const data = await prisma.clientSupplierModel.findMany({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    resp.data = data as ClientSupplier[];
    resp.success = true;
    console.log("=>clients-suppliers/get-all-by-company");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
