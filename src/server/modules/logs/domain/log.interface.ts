export interface Log {
  id: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  requestPath: string;
  countryCode: string | null;
  deviceType: string | null;
  timezone: string | null;
  userId: string | null;
  createdAt: Date;
}
