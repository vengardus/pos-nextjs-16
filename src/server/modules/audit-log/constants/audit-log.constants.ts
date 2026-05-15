export const AUDIT_ACTIONS = {
  DELETE_ALL_USERS: "DELETE_ALL_USERS",
  // Añadir aquí futuras acciones:
  // UPDATE_PRODUCT: "UPDATE_PRODUCT",
} as const;

export const AUDIT_SYSTEM_USER = "SYSTEM";

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
