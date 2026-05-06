import { z } from "zod";
import { AuthorizedProviderEmailExpirationDateSchema } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";

export const AuthorizedProviderEmailInputSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().trim().toLowerCase().email(),
  clientName: z.string().trim().min(1).max(150),
  expirationDate: AuthorizedProviderEmailExpirationDateSchema,
  isActive: z.boolean().default(true),
  isSuperAdmin: z.boolean().default(false),
});

export type AuthorizedProviderEmailInput = z.infer<
  typeof AuthorizedProviderEmailInputSchema
>;
