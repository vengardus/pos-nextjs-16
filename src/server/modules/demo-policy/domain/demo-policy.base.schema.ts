import { z } from "zod";

export const DemoPolicyBaseSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  authorizedProviderEmailId: z.string().uuid().nullable(),
  isEnabled: z.boolean(),
  maxUsers: z.number().int().positive(),
  maxRecordsPerEntity: z.number().int().positive(),
  maxGuestSignupsPerIpPerDay: z.number().int().positive(),
  guestTtlDays: z.number().int().positive(),
  allowCsvImportForGuest: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
