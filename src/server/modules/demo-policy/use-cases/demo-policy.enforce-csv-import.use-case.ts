import "server-only";

import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";

export const demoPolicyEnforceCsvImportUseCase = async (
  _companyId: string,
  role: string
): Promise<void> => {
  if (role !== UserRole.GUEST) {
    return;
  }

  throw new Error("No habilitado para usuario demo");
};
