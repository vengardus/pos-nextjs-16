import { z } from "zod";

export const DemoPolicyInputSchema = z.object({
  companyId: z.string().uuid(),
  isEnabled: z.boolean(),
  maxUsers: z.number().int().min(1).max(999999),
  maxRecordsPerEntity: z.number().int().min(1).max(999999),
  maxGuestSignupsPerIpPerDay: z.number().int().min(1).max(999999),
  guestTtlDays: z.number().int().min(1).max(365),
  allowCsvImportForGuest: z.boolean(),
});

export type DemoPolicyInput = z.infer<typeof DemoPolicyInputSchema>;
