import 'server-only';

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

import { permissionGetAllByCompanyRoleCodRepository } from "../repository/permission.get-all-by-company-role-cod.repository";

export const permissionGetAllByCompanyRoleCodUseCase = async (
  companyId: string,
  roleCod: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    if (!roleCod || !companyId) throw new Error("Role y compañia son requeridos");
    const data = await permissionGetAllByCompanyRoleCodRepository(companyId, roleCod);
    resp.data = data;
    resp.success = true;
    console.log("query=>permissionGetAllByCompanyRoleCod", companyId, roleCod);
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
