"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

// Configuration Cloudinary

export const paymentMethodInsertOrUpdate = async (
  paymentmethod: PaymentMethod,
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, ...rest } = paymentmethod;

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let proccesPaymentMethod: PaymentMethod = paymentmethod;

      // Determinar si es create or update
      if (id) {
        // Update
        proccesPaymentMethod = await prisma.paymentMethodModel.update({
          where: {
            id,
          },
          data: {
            ...rest,
            //imageUrl: respImages.data[0],
          },
        });
      } else {
        // create
        proccesPaymentMethod = await prisma.paymentMethodModel.create({
          data: {
            ...rest,
          },
        });
      }

      return {
        proccesPaymentMethod,
      };
    });
    resp.data = prismaTx.proccesPaymentMethod;
    resp.success = true;

    console.log("updateTag: ", `payment-methods-${prismaTx.proccesPaymentMethod.companyId}`)

    updateTag(`payment-methods-${prismaTx.proccesPaymentMethod.companyId}`, );
    //revalidatePath("/pos");
    revalidatePath("/config/payment-methods");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

