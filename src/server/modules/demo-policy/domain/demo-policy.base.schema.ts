import { z } from "zod";

export const DemoPolicyBaseSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  authorizedProviderEmailId: z.string().uuid().nullable(),
  isEnabled: z.boolean(),
  maxUsers: z.number().int().min(1),
  maxRecordsPerEntity: z.number().int().min(1),
  maxGuestSignupsPerIpPerDay: z.number().int().min(1),
  guestTtlDays: z.number().int().min(1),
  allowCsvImportForGuest: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export type DemoPolicy = z.infer<typeof DemoPolicyBaseSchema>;
