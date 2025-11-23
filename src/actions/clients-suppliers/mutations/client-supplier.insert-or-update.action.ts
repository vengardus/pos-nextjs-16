"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";
import { AppConstants } from "@/constants/app.constants";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

// Configuration Cloudinary

export const clientSupplierInsertOrUpdate = async (
  clientsupplier: ClientSupplier,
): Promise<ResponseAction> => {
  const resp = initResponseAction();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, Company, ...rest } = clientsupplier;

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let proccesClientSupplier: ClientSupplier = clientsupplier;

      // Determinar si es create or update
      if (id) {
        // Update
        proccesClientSupplier = await prisma.clientSupplierModel.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        });
      } else {
        // create
        proccesClientSupplier = await prisma.clientSupplierModel.create({
          data: {
            ...rest,
            status: AppConstants.DEFAULT_VALUES.states.active,
          },
        });
      }

      return {
        proccesClientSupplier,
      };
    });
    resp.data = prismaTx.proccesClientSupplier;
    resp.success = true;

    updateTag(`clients-suppliers-${prismaTx.proccesClientSupplier.companyId}`);
    // revalidatePath("/pos");
    revalidatePath("/config/clients-suppliers");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

