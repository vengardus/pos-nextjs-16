"use server";

/*
  Llama a sp insert-superadmin, el cual:
  - inserta un usuario superadmin al autenticarse por primera vez (users), 
  - ademas se insertan registros en tablas básicas con valores por defecto:
    - companies  
    - document_types
    - branches
    - categories
    - branch_user
    - brands
*/

import prisma from "@/infrastructure/db/prisma";
import bcrypt from "bcryptjs";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

interface SuperadminParams {
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
export const userInsertSuperadmin = async (
  params: SuperadminParams
): Promise<ResponseAction> => {
  const {
    authId,
    roleId,
    email,
    currencySymbol,
    companyName,
    documentTypeName,
    categoryName,
    categoryColor,
    password,
    authType,
    imageUrl,
    userName,
    brandName,
    clientName,
    personType
  } = params;
  const resp = initResponseAction();

  try {
    let hashedPassword = null
    if (password.length)
      hashedPassword = await bcrypt.hash(password, 10);
    console.log("INSERT SUPERADMIN");
    const result = await prisma.$queryRawUnsafe<Array<{ insert_superadmin: string }>>(
      "SELECT insert_superadmin($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
      authId,
      roleId,
      email,
      currencySymbol,
      companyName,
      documentTypeName,
      categoryName,
      categoryColor,
      hashedPassword?? password,
      authType,
      imageUrl,
      userName,
      brandName,
      clientName,
      personType
    );
    resp.data = result[0].insert_superadmin;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
