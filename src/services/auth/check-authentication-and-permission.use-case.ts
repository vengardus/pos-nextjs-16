import type { Company } from "@/types/interfaces/company/company.interface";
import { ModuleEnum } from "@/types/enums/module.enum";
import { companyGetByUserCached } from "@/actions/companies/cache/company.cache";
import { hasModulePermission } from "./has-module-permission.use-case";
import { getAuthCached } from "./get-auth.cached";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { cacheTag } from "next/cache";
import { companyGetByUser } from "@/actions/companies/querys/company.get-by-user.action";


interface checkAuthenticationAndPermissionResult {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
  userName: string | null;
  company: Company | null;
  errorMessage?: string;
}
export const checkAuthenticationAndPermission = async (
  module: ModuleEnum
): Promise<checkAuthenticationAndPermissionResult> => {

  const response: checkAuthenticationAndPermissionResult = {
    isAuthenticated: false,
    userId: null,
    userName: null,
    role: null,
    company: null,
    errorMessage: undefined,
  };

  // verify user authentication
  //const sessionResponse = await authGetSession();
  const sessionResponse = await getAuthCached();

  if (!sessionResponse.data.isAuthenticated) {
    response.errorMessage = `Error: Usuario no autenticado - ${sessionResponse.message}`;
    return response;
  }
  const userId = sessionResponse.data.sessionUser.id;
  const role = sessionResponse.data.sessionUser.role;
  const userName = sessionResponse.data.sessionUser.name;

  // get company
  const companyResponse = await companyGetByUserCached(userId, role);
  if (!companyResponse.success) {
    response.errorMessage = `Error al consultar Compañia - ${companyResponse.message}`;
    return response;
  }
  const company = companyResponse.data;

  if (!company) {
    response.errorMessage = `No se encontró compañía.`;
    return response;
  }

  // validate user´s permission
  const hasPermissionResponse = await hasModulePermission(company.id, role, module);
  if (!hasPermissionResponse.success) {
    response.errorMessage = hasPermissionResponse.message;
    return response;
  }

  response.isAuthenticated = sessionResponse.data.isAuthenticated;
  response.userId = userId;
  response.userName = userName;
  response.role = role;
  response.company = company;
  return response;
};


export async function companyGetByUserCached3(
  userId: string,
  role: string
): Promise<ResponseAction> {
  "use cache";
  cacheTag(`company-user-${userId}`);
  //cacheLife(CacheConfig.CacheDurations);
  return await companyGetByUser(userId, role);
}