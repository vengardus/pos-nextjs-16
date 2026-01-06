import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { redirect } from "next/navigation";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";

export default async function ConfigCompaniesPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.pos
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;

  redirect("/config/companies/general");
}
