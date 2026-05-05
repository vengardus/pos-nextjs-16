import { z } from "zod";

export const AuthGuestSignupSchema = z.object({
  nickname: z.string().min(3).max(10).regex(/^[a-zA-Z0-9_]+$/, "Solo alfanuméricos y guiones bajos"),
  callbackUrl: z.string().optional(),
});
