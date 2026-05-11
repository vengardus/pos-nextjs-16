import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { redirect } from "next/navigation";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";

export default async function ConfigCompaniesPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.pos
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated || authenticatationAndPermissionResponse.role === UserRole.GUEST)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.role === UserRole.GUEST ? "El rol GUEST no tiene permisos para este módulo." : authenticatationAndPermissionResponse.errorMessage} />;

  redirect("/config/companies/general");
}
