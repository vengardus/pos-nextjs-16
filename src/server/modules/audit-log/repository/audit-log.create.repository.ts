import { db } from "@/server/db/prisma";
import type { AuditLog } from "@prisma/client";

export const auditLogCreateRepository = async (data: {
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  userId?: string;
}): Promise<AuditLog> => {
  return await db.auditLog.create({
    data: {
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      details: data.details,
      userId: data.userId,
    },
  });
};
