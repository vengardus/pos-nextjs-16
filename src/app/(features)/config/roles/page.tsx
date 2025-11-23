import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { CustomCrud } from "@/app/(features)/config/roles/components/custom-crud";
import { ModuleEnum } from "@/types/enums/module.enum";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";
import { roleGetAllByCompanyCached } from "@/actions/roles/cache/role.cache";
import { mapNavbarItemsToModules } from "@/mappers/module.mapper";

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
