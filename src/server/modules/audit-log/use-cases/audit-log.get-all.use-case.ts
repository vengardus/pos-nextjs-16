import { auditLogGetAllRepository } from "../repository/audit-log.get-all.repository";

export const auditLogGetAllUseCase = async () => {
  return await auditLogGetAllRepository();
};
