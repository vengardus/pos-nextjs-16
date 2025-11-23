"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Company } from "@/types/interfaces/company/company.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
//import { UserRole } from "@/interfaces/app/user-role.enum";

export const companyGetByUser = async (userId: string, role: string): Promise<ResponseAction> => {
  //TODO: pendiente refactorizar
  // if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
  //   return getByUserForAdmin(userId);
  // } else {
  console.log("role", role);
    return getByUserForUser(userId);
  // }
};

export const getByUserForAdmin = async (
  userId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!userId) throw new Error("User id is required");

    const data = await prisma.companyModel.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        userId: true,
        taxAddress: true,
        taxGlose: true,
        taxValue: true,
        imageUrl: true,
        country: true,
        currency: true,
        currencySymbol: true,
        iso: true,
      },
    });

    resp.data = data ? data[0] : (null as Company | null);
    resp.success = resp.data ? true : false;

    console.log("=>company/get-by-user-for-admin");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};

/**
 * TODO: pendiente refactorizar
 * Obtiene la compañia del usuario por medio de la sucursal a la que pertenece
 */
export const getByUserForUser = async (
  userId: string
): Promise<ResponseAction> => {

  const resp = initResponseAction();

  try {
    if (!userId) throw new Error("User id is required");

    prisma.branchUserModel.findFirst({
      where: { userId },
      include: {
        Branch: {
          include: {
            Company: {
              select: {
                id: true,
                name: true,
                taxId: true
              }
            }
          }
        }
      }
    })


    const data = await prisma.branchUserModel.findFirst({
      where: { userId: userId as string },
      include: {
        Branch: {
          include: {
            Company: true,
          },
        },
      },
    });

    resp.data = data
      ? (data.Branch.Company as Company)
      : (null as Company | null);
    resp.success = resp.data ? true : false;

    console.log("=>company/get-by-user-for-user");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
