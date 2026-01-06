import 'server-only'

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import {
  //companyGetByUserForAdminRepository,
  companyGetByUserForUserRepository,
} from "@/server/modules/company/repository/company.get-by-user.repository";

export const companyGetByUserUseCase = async (
  userId: string,
  role: string
): Promise<ResponseAction> => {
  //TODO: pendiente refactorizar
  // if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
  //   return companyGetByUserForAdminRepository(userId);
  // } else {
  console.log("role", role, "userId", userId);
  return companyGetByUserForUserRepository(userId);
  // }
};
 