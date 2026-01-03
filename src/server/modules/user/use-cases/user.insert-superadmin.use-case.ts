import "server-only";

import bcrypt from "bcryptjs";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { userInsertSuperadminRepository } from "../repository/user.insert-superadmin.repository";

export interface SuperadminParams {
  authId: string;
  roleId: string;
  email: string;
  currencySymbol: string;
  companyName: string;
  documentTypeName: string;
  categoryName: string;
  categoryColor: string;
  password: string;
  authType: string;
  imageUrl: string;
  userName: string;
  brandName: string;
  clientName: string;
  personType: string;
}

export const userInsertSuperadminUseCase = async (
  params: SuperadminParams
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const { password } = params;

    let hashedPassword = null;
    if (password.length) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    console.log("INSERT SUPERADMIN");

    const result = await userInsertSuperadminRepository(params, hashedPassword);
    resp.data = result[0].insert_superadmin;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
