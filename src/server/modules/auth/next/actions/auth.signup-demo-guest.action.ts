"use server";

import { headers } from "next/headers";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { authSignupDemoGuestUseCase } from "../../use-cases/auth.signup-demo-guest.use-case";

const resolveClientIp = (forwardedForHeader: string | null): string => {
  if (!forwardedForHeader) return "unknown";
  return forwardedForHeader.split(",")[0]?.trim() || "unknown";
};

export const authSignupDemoGuestAction = async (formData: FormData): Promise<ResponseAction> => {
  const headerStore = await headers();
  const ipAddress = resolveClientIp(headerStore.get("x-forwarded-for"));
  const userAgent = headerStore.get("user-agent") || "unknown";
  const requestPath = headerStore.get("x-pathname") || "/login-guest";
  const timezone = (formData.get("timezone") as string | null) || undefined;

  let deviceType = "Desktop";
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) deviceType = "Tablet";
  else if (/mobile|iphone|ipod|android/i.test(userAgent)) deviceType = "Mobile";

  return authSignupDemoGuestUseCase(formData, {
    ipAddress,
    userAgent,
    requestPath,
    deviceType,
    timezone,
  });
};
