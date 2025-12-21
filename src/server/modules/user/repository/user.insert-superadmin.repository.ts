import "server-only";

import prisma from "@/server/db/prisma";
import type { SuperadminParams } from "../use-cases/user.insert-superadmin.use-case";

export const userInsertSuperadminRepository = async (
  params: SuperadminParams,
  hashedPassword: string | null
): Promise<Array<{ insert_superadmin: string }>> => {
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
    personType,
  } = params;

  return await prisma.$queryRawUnsafe<Array<{ insert_superadmin: string }>>(
    "SELECT insert_superadmin($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
    authId,
    roleId,
    email,
    currencySymbol,
    companyName,
    documentTypeName,
    categoryName,
    categoryColor,
    hashedPassword ?? password,
    authType,
    imageUrl,
    userName,
    brandName,
    clientName,
    personType
  );
};
