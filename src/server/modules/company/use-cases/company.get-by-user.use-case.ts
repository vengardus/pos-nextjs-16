import 'server-only'

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import {
  getByUserForAdmin,
  getByUserForUser,
} from "@/server/modules/company/repository/company.get-by-user.repository";

export const companyGetByUser = async (
  userId: string,
  role: string
): Promise<ResponseAction> => {
  //TODO: pendiente refactorizar
  // if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
  //   return getByUserForAdmin(userId);
  // } else {
  console.log("role", role, "userId", userId);
  return getByUserForUser(userId);
  // }
};

export { getByUserForAdmin, getByUserForUser };
