import "server-only";

import prisma from "@/server/db/prisma";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { demoPolicyGetByCompanyIdRepository } from "@/server/modules/demo-policy/repository/demo-policy.get-by-company-id.repository";

interface EnforceDemoWriteLimitParams {
  companyId: string;
  role: string;
  modelName:
    | "saleModel"
    | "productModel"
    | "categoryModel"
    | "clientSupplierModel"
    | "branchModel"
    | "cashRegisterModel"
    | "permissionModel"
    | "roleModel"
    | "documentTypeModel";
}

export const demoPolicyEnforceWriteLimitUseCase = async ({
  companyId,
  role,
  modelName,
}: EnforceDemoWriteLimitParams): Promise<void> => {
  if (role !== UserRole.GUEST) {
    return;
  }

  const policy = await demoPolicyGetByCompanyIdRepository(companyId);
  if (!policy || !policy.isEnabled) {
    return;
  }

  const limit = policy.maxRecordsPerEntity;
  let count = 0;

  switch (modelName) {
    case "saleModel":
      count = await prisma.saleModel.count({ where: { companyId } });
      break;
    case "productModel":
      count = await prisma.productModel.count({ where: { companyId } });
      break;
    case "categoryModel":
      count = await prisma.categoryModel.count({ where: { companyId } });
      break;
    case "clientSupplierModel":
      count = await prisma.clientSupplierModel.count({ where: { companyId } });
      break;
    case "branchModel":
      count = await prisma.branchModel.count({ where: { companyId } });
      break;
    case "cashRegisterModel":
      count = await prisma.cashRegisterModel.count({
        where: {
          Branch: {
            companyId,
          },
        },
      });
      break;
    case "permissionModel":
      count = await prisma.permissionModel.count({ where: { companyId } });
      break;
    case "roleModel":
      count = await prisma.roleModel.count({ where: { companyId } });
      break;
    case "documentTypeModel":
      count = await prisma.documentTypeModel.count({ where: { companyId } });
      break;
    default:
      count = 0;
      break;
  }

  if (count >= limit) {
    throw new Error(
      `Modo demo: alcanzaste el límite de ${limit} registros para esta entidad.`
    );
  }
};
