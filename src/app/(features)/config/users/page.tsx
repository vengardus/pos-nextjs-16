import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";
import { Suspense } from "react";
import { CustomCrud } from "./components/custom-crud";
import { documentTypeGetAllByCompanyCached } from "@/actions/document-types/cache/document-type.cache";
import { userGetAllByCompanyCached } from "@/actions/users/cache/user.cache";
import { roleGetAllByCompanyCached } from "@/actions/roles/cache/role.cache";
import { branchGetAllByCompanyCached } from "@/actions/branches/cache/branch.cache";

export default async function UserConfigPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.users);
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // obtener documntTypes, branches, users
  const [respDocumentTypes, respBranches, respUsers, respRoles] = await Promise.all([
    documentTypeGetAllByCompanyCached(company.id),
    branchGetAllByCompanyCached(company.id),
    userGetAllByCompanyCached(company.id),
    roleGetAllByCompanyCached(company.id),
  ]);

  //  validas documentTypes
  if (!respDocumentTypes.success)
    return <ShowPageMessage modelName={"Tipos de documentos"} errorMessage={respDocumentTypes.message} />;
  const documentTypes = respDocumentTypes.data;

  // valida branches
  if (!respBranches.success) 
    return <ShowPageMessage modelName={"Sucursales"} errorMessage={respBranches.message} />;
  const branches = respBranches.data;

  // valida users
  if (!respUsers.success) 
    return <ShowPageMessage modelName={"Usuarios"} errorMessage={respUsers.message} />;
  const users = respUsers.data;

  // valida roles
  if (!respRoles.success) 
    return <ShowPageMessage modelName={"Roles"} errorMessage={respRoles.message} />;
  const roles = respRoles.data;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomCrud data={{ company, documentTypes, branches, users, roles }} />
    </Suspense>
  );
}
