import "server-only";

import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/auth";
import prisma from "@/server/db/prisma";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { AppConstants } from "@/shared/constants/app.constants";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { AuthGuestSignupSchema } from "../domain/auth.guest-signup.schema";
import {
  demoPolicyResolveBySuperAdminEmailUseCase,
  type DemoPolicyContext,
} from "@/server/modules/demo-policy/use-cases/demo-policy.resolve-by-superadmin-email.use-case";

interface GuestSignupRequestContext {
  ipAddress: string;
  userAgent: string;
  requestPath: string;
  countryCode?: string;
  deviceType?: string;
  timezone?: string;
}

const GUEST_SIGNUP_LOG_ACTION = "guest_signup";
const GUEST_RESUME_LOG_ACTION = "guest_resume";

const resolveStartOfDayUtc = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export const authSignupDemoGuestUseCase = async (
  formData: FormData,
  context: GuestSignupRequestContext
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const parsed = AuthGuestSignupSchema.parse({
      nickname: formData.get("nickname"),
      callbackUrl: formData.get("callbackUrl"),
    });
    const continueExisting = formData.get("continueExisting") === "1";

    const normalizedNickname = parsed.nickname.trim().toLowerCase();
    const guestEmail = `${normalizedNickname}@pos.local`;
    const callbackUrl = parsed.callbackUrl || AppConstants.URL_HOME;

    const superAdminEmail = process.env.DEMO_SUPERADMIN_EMAIL ?? "";
    const policyResp = await demoPolicyResolveBySuperAdminEmailUseCase(
      superAdminEmail
    );

    if (!policyResp.success || !policyResp.data) {
      resp.message = policyResp.message ?? "No se pudo resolver la política demo.";
      return resp;
    }

    const { companyId, policy } = policyResp.data as DemoPolicyContext;
    const existingUser = await prisma.userModel.findUnique({
      where: { email: guestEmail },
      select: { id: true, roleId: true },
    });

    if (existingUser) {
      if (existingUser.roleId !== UserRole.GUEST) {
        resp.message = "El nickname ya está en uso. Prueba con otro.";
        return resp;
      }

      const belongsToDemoCompany = await prisma.branchUserModel.count({
        where: {
          userId: existingUser.id,
          Branch: {
            companyId,
          },
        },
      });

      if (belongsToDemoCompany === 0) {
        resp.message = "El nickname ya está en uso. Prueba con otro.";
        return resp;
      }

      if (!continueExisting) {
        resp.message =
          "Este nick ya existe. ¿Deseas continuar con esta sesión demo o cambiar de nick?";
        resp.data = {
          requiresGuestResumeDecision: true,
        };
        return resp;
      }

      const generatedPassword = randomUUID();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      await prisma.userModel.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          authType: "credentials",
          authId: guestEmail,
          name: normalizedNickname,
        },
      });

      await prisma.logModel.create({
        data: {
          action: GUEST_RESUME_LOG_ACTION,
          description: `Reingreso demo: ${guestEmail}`,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          requestPath: context.requestPath,
          countryCode: context.countryCode,
          deviceType: context.deviceType,
          timezone: context.timezone,
          userId: existingUser.id,
        },
      });

      await signIn("credentials", {
        email: guestEmail,
        password: generatedPassword,
        redirectTo: callbackUrl,
      });

      resp.success = true;
      return resp;
    }

    const guestRole = await prisma.roleModel.findFirst({
      where: {
        companyId,
        cod: UserRole.GUEST,
      },
      select: {
        id: true,
      },
    });

    if (!guestRole) {
      resp.message = "No existe rol GUEST configurado para la compañía demo.";
      return resp;
    }

    await prisma.permissionModel.createMany({
      data: [
        {
          roleId: guestRole.id,
          companyId,
          roleCod: UserRole.GUEST,
          moduleCod: ModuleEnum.pos,
          isGroup: false,
        },
        {
          roleId: guestRole.id,
          companyId,
          roleCod: UserRole.GUEST,
          moduleCod: ModuleEnum.dashboard,
          isGroup: false,
        },
        {
          roleId: guestRole.id,
          companyId,
          roleCod: UserRole.GUEST,
          moduleCod: ModuleEnum.config,
          isGroup: false,
        },
        {
          roleId: guestRole.id,
          companyId,
          roleCod: UserRole.GUEST,
          moduleCod: ModuleEnum.profile,
          isGroup: false,
        },
      ],
      skipDuplicates: true,
    });

    const dayStart = resolveStartOfDayUtc();
    const signupsByIpToday = await prisma.logModel.count({
      where: {
        action: GUEST_SIGNUP_LOG_ACTION,
        ipAddress: context.ipAddress,
        createdAt: {
          gte: dayStart,
        },
      },
    });

    if (signupsByIpToday >= policy.maxGuestSignupsPerIpPerDay) {
      resp.message =
        "Se alcanzó el límite de registros de invitado por IP para hoy.";
      return resp;
    }

    const totalGuestUsers = await prisma.userModel.count({
      where: {
        roleId: UserRole.GUEST,
        BranchUser: {
          some: {
            Branch: {
              companyId,
            },
          },
        },
      },
    });

    if (totalGuestUsers >= policy.maxUsers) {
      resp.message = "Se alcanzó el máximo de usuarios demo permitidos.";
      return resp;
    }

    const defaultBranch = await prisma.branchModel.findFirst({
      where: { companyId },
      orderBy: { isDefault: "desc" },
      select: {
        id: true,
        CashRegister: {
          select: { id: true },
          orderBy: { isDefault: "desc" },
          take: 1,
        },
      },
    });

    if (!defaultBranch) {
      resp.message = "La compañía demo no tiene sucursal configurada.";
      return resp;
    }

    const defaultCashRegisterId = defaultBranch.CashRegister[0]?.id ?? null;
    if (!defaultCashRegisterId) {
      resp.message = "La sucursal demo no tiene caja configurada.";
      return resp;
    }

    const generatedPassword = randomUUID();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const createdUser = await prisma.userModel.create({
      data: {
        email: guestEmail,
        password: hashedPassword,
        name: normalizedNickname,
        roleId: UserRole.GUEST,
        authType: "credentials",
        authId: guestEmail,
      },
      select: { id: true },
    });

    await prisma.branchUserModel.create({
      data: {
        branchId: defaultBranch.id,
        userId: createdUser.id,
        cashRegisterId: defaultCashRegisterId,
      },
    });

    await prisma.logModel.create({
      data: {
        action: GUEST_SIGNUP_LOG_ACTION,
        description: `Registro demo: ${guestEmail}`,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        requestPath: context.requestPath,
        countryCode: context.countryCode,
        deviceType: context.deviceType,
        timezone: context.timezone,
        userId: createdUser.id,
      },
    });

    await signIn("credentials", {
      email: guestEmail,
      password: generatedPassword,
      redirectTo: callbackUrl,
    });

    resp.success = true;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    resp.message = getActionError(error);
  }

  return resp;
};
