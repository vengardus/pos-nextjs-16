import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { CustomCrud } from "@/app/(features)/config/roles/components/custom-crud";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { roleGetAllByCompanyCached } from "@/server/modules/role/next/cache/role.cache";
import { mapNavbarItemsToModules } from "@/server/modules/permission/utils/module.mapper";

export default async function RolesPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.roles);
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // obtener roles y permisos
  const respRoles = await roleGetAllByCompanyCached(company.id);
  if (!respRoles.success) {
    return <ShowPageMessage modelName={"Roles"} errorMessage={respRoles.message} />;
  }
  const roles = respRoles.data;

  const modules = mapNavbarItemsToModules();

  return (
      <CustomCrud data={{ company, roles, modules }} />
  );
}
