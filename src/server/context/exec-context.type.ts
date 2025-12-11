export type ExecContext = {
  companyId: string;
  userId?: string | null;
  authSource: "session" | "authCode";
};