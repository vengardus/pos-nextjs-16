import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import prisma from "@/server/db/prisma";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { DemoPolicyBaseSchema } from "@/server/modules/demo-policy/domain/demo-policy.base.schema";

export interface DemoPolicyContext {
  superAdminUserId: string;
  companyId: string;
  policy: ReturnType<typeof DemoPolicyBaseSchema.parse>;
}

export const demoPolicyResolveBySuperAdminEmailUseCase = async (
  superAdminEmail: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const normalizedEmail = superAdminEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error(
        "No se pudo inicializar el modo demo. No está disponible una configuración válida."
      );
    }

    const superAdmin = await prisma.userModel.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, roleId: true },
    });

    if (!superAdmin) {
      throw new Error("No se encontró configuración disponible para el modo demo.");
    }

    if (superAdmin.roleId !== UserRole.SUPER_ADMIN) {
      throw new Error("La configuración actual no permite habilitar el modo demo.");
    }

    const company = await prisma.companyModel.findFirst({
      where: { userId: superAdmin.id },
      orderBy: { isDefault: "desc" },
      select: { id: true },
    });

    if (!company) {
      throw new Error("No se encontró una compañía disponible para el modo demo.");
    }

    const policyRecord = await prisma.demoPolicyModel.findUnique({
      where: { companyId: company.id },
      select: {
        id: true,
        companyId: true,
        authorizedProviderEmailId: true,
        isEnabled: true,
        maxUsers: true,
        maxRecordsPerEntity: true,
        maxGuestSignupsPerIpPerDay: true,
        guestTtlDays: true,
        allowCsvImportForGuest: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!policyRecord) {
      throw new Error("No hay políticas demo disponibles en este momento.");
    }

    const parsedPolicyResult = DemoPolicyBaseSchema.safeParse(policyRecord);
    if (!parsedPolicyResult.success) {
      throw new Error(
        "La configuración de política demo es inválida. Contacte al administrador."
      );
    }

    const parsedPolicy = parsedPolicyResult.data;

    if (!parsedPolicy.isEnabled) {
      throw new Error("El modo demo está deshabilitado para esta compañía.");
    }

    resp.success = true;
    resp.data = {
      superAdminUserId: superAdmin.id,
      companyId: company.id,
      policy: parsedPolicy,
    } satisfies DemoPolicyContext;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
