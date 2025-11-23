import { permissionGetAllByCompanyRoleCodCached } from "@/actions/permissions/cache/permission.cache";
import { RoleBusiness } from "@/business/role.business";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";

export const hasModulePermission = async (
  companyId: string,
  role: string,
  module: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  // Si el rol es role permitido por defecto
  if (RoleBusiness.isRoleAllowed(role)) {
    resp.success = true;
    return resp;
  }

  // valida permiso para el modulo
  const respPermissions = await permissionGetAllByCompanyRoleCodCached(companyId, role);
  console.log(companyId, role, module);
  if (!respPermissions.success) {
    resp.message = `Error al consultar Permisos`;
  } else if (!RoleBusiness.isModuleAllowed(role, module, respPermissions.data)) {
    resp.message = `No tiene permiso para acceder a éste módulo.`;
  } else resp.success = true;

  return resp;
};
