import "server-only";
import { initResponseAction } from "@/utils/response/init-response-action";
import { demoPolicyGetByCompanyRepository } from "../repository/demo-policy.get-by-company.repository";
import { DemoPolicyBaseSchema } from "../domain/demo-policy.base.schema";
import { getActionError } from "@/utils/errors/get-action-error";
import { prisma } from "@/server/db/prisma";

export const demoPolicyResolveBySuperAdminEmailUseCase = async (superAdminEmail: string) => {
  const resp = initResponseAction();

  try {
    // 1. Obtener el superadmin (asumimos que existe y es único por email)
    const superAdmin = await prisma.userModel.findUnique({
      where: { email: superAdminEmail.toLowerCase().trim() },
      select: { id: true, roleId: true },
    });

    if (!superAdmin) {
      resp.message = "No se encontró configuración para el email proporcionado.";
      return resp;
    }

    // 2. Obtener compañía (asumimos que la primera por defecto es la demo)
    const company = await prisma.companyModel.findFirst({
      where: { userId: superAdmin.id },
      orderBy: { isDefault: "desc" },
      select: { id: true },
    });

    if (!company) {
      resp.message = "No se encontró compañía asociada.";
      return resp;
    }

    // 3. Obtener política
    const policy = await demoPolicyGetByCompanyRepository(company.id);
    if (!policy || !policy.isEnabled) {
      resp.message = "Política demo no configurada o deshabilitada.";
      return resp;
    }

    resp.success = true;
    resp.data = {
      superAdminUserId: superAdmin.id,
      companyId: company.id,
      policy: DemoPolicyBaseSchema.parse(policy),
    };
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
