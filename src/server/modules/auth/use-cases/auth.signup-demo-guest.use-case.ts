import "server-only";

import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/prisma";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { AuthGuestSignupSchema } from "../domain/auth.guest-signup.schema";
import { demoPolicyResolveBySuperAdminEmailUseCase } from "../../demo-policy/use-cases/demo-policy.resolve-by-superadmin-email.use-case";

interface GuestSignupRequestContext {
  ipAddress: string;
  userAgent: string;
  requestPath: string;
  deviceType?: string;
  timezone?: string;
}

export const authSignupDemoGuestUseCase = async (
  formData: FormData,
  _context: GuestSignupRequestContext
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const parsed = AuthGuestSignupSchema.parse({
      nickname: formData.get("nickname"),
      callbackUrl: formData.get("callbackUrl"),
    });

    const normalizedNickname = parsed.nickname.trim().toLowerCase();
    const guestEmail = `${normalizedNickname}@pos.local`;

    const superAdminEmail = process.env.DEMO_SUPERADMIN_EMAIL ?? "";
    const policyResp = await demoPolicyResolveBySuperAdminEmailUseCase(superAdminEmail);

    if (!policyResp.success || !policyResp.data) {
      resp.message = policyResp.message ?? "No se pudo resolver la política demo.";
      return resp;
    }

    const { companyId, policy } = policyResp.data;

    // 1. Verificar si existe
    const existingUser = await prisma.userModel.findUnique({
      where: { email: guestEmail },
      select: { id: true, name: true },
    });

    if (existingUser) {
        resp.success = true;
        resp.data = { email: guestEmail, isExisting: true };
        return resp;
    }

    // 2. Validación límites
    const totalGuestUsers = await prisma.userModel.count({
      where: { roleId: UserRole.GUEST },
    });

    if (totalGuestUsers >= policy.maxUsers) {
      resp.message = "Se alcanzó el máximo de usuarios demo permitidos.";
      return resp;
    }

    // 3. Crear Guest
    const defaultBranch = await prisma.branchModel.findFirst({
        where: { companyId },
        orderBy: { isDefault: "desc" },
        select: { id: true, CashRegister: { select: { id: true }, take: 1 } },
    });

    if (!defaultBranch) {
        resp.message = "Sucursal demo no configurada.";
        return resp;
    }

    const generatedPassword = randomUUID();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const guestRole = await prisma.roleModel.findFirst({
        where: { companyId, cod: UserRole.GUEST },
        select: { id: true }
    });
    
    if (!guestRole) {
        resp.message = "No existe rol GUEST configurado.";
        return resp;
    }

    await prisma.userModel.create({
      data: {
        email: guestEmail,
        password: hashedPassword,
        name: normalizedNickname,
        roleId: guestRole.id,
        authType: "credentials",
        authId: guestEmail,
        BranchUser: {
            create: {
                branchId: defaultBranch.id,
                cashRegisterId: defaultBranch.CashRegister[0]?.id ?? null
            }
        }
      },
    });

    resp.success = true;
    resp.data = { email: guestEmail, generatedPassword, isExisting: false };
  } catch (error) {
    resp.message = "Error en el registro de invitado.";
  }

  return resp;
};
