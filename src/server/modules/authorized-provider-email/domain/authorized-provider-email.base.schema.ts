import { z } from "zod";

const normalizeExpirationDateText = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  const isoDateMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDateMatch) {
    return isoDateMatch[1];
  }

  const legacyDateMatch = trimmed.match(/^(\d{4})[/-](\d{2})[/-](\d{2})$/);
  if (legacyDateMatch) {
    const [, year, month, day] = legacyDateMatch;
    return `${year}-${month}-${day}`;
  }

  return trimmed;
};

export const AuthorizedProviderEmailExpirationDateSchema = z
  .preprocess(
    normalizeExpirationDateText,
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato yyyy-MM-dd.")
  );

export const AuthorizedProviderEmailBaseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().trim().toLowerCase().email(),
  clientName: z.string().trim().min(1).max(150),
  expirationDate: AuthorizedProviderEmailExpirationDateSchema,
  isActive: z.boolean().default(true),
  isSuperAdmin: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export type AuthorizedProviderEmail = z.infer<
  typeof AuthorizedProviderEmailBaseSchema
>;

export const AuthorizedProviderEmailValidationStatusSchema = z.enum([
  "AUTHORIZED",
  "NOT_FOUND",
  "INACTIVE",
  "EXPIRED",
]);

export type AuthorizedProviderEmailValidationStatus = z.infer<
  typeof AuthorizedProviderEmailValidationStatusSchema
>;
