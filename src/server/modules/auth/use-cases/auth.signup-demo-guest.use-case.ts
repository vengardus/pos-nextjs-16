import "server-only";

import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/auth";
import { prisma } from "@/server/db/prisma";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { AppConstants } from "@/shared/constants/app.constants";
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
    const callbackUrl = parsed.callbackUrl || AppConstants.URL_HOME;

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
      select: { id: true, roleId: true },
    });

    if (existingUser) {
        const generatedPassword = randomUUID();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        await prisma.userModel.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword }
        });

        await signIn("credentials", {
            email: guestEmail,
            password: generatedPassword,
            redirectTo: callbackUrl,
        });
        resp.success = true;
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

    // Obtener rol GUEST para asegurar ID
    const guestRole = await prisma.roleModel.findFirst({
        where: { companyId, cod: UserRole.GUEST },
        select: { id: true }
    });
    
    if (!guestRole) {
        resp.message = "No existe rol GUEST configurado.";
        return resp;
    }

    const createdUser = await prisma.userModel.create({
      data: {
        email: guestEmail,
        password: hashedPassword,
        name: normalizedNickname,
        roleId: guestRole.id, // Usar ID real del rol
        authType: "credentials",
        authId: guestEmail,
      },
    });

    await prisma.branchUserModel.create({
      data: {
        branchId: defaultBranch.id,
        userId: createdUser.id,
        cashRegisterId: defaultBranch.CashRegister[0]?.id ?? null,
      },
    });

    try {
        await signIn("credentials", {
          email: guestEmail,
          password: generatedPassword,
          redirectTo: callbackUrl,
        });
    } catch (error) {
        if (isRedirectError(error)) throw error;
        throw error;
    }
    
    resp.success = true;
  } catch (error) {
    console.error("Error en registro:", error);
    resp.message = "Error en el registro de invitado.";
  }

  return resp;
};
