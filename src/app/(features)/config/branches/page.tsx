import type { BranchUser } from "@/types/interfaces/branch-user/branch-user.interface";
import { BranchHeader } from "@/app/(features)/config/branches/components/branch-header";
import { BranchesUI } from "@/app/(features)/config/branches/components/branches-ui";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { branchUserGetAllByUserCached } from "@/lib/data/branch-users/branch-user.cache";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";

export default async function BranchesPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.pos
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const currentUser = {
    id: authenticatationAndPermissionResponse.userId!,
    userName: authenticatationAndPermissionResponse.userName!,
    role: authenticatationAndPermissionResponse.role!,
  };

  // obtener sucursales del usuario
  const respBranches = await branchUserGetAllByUserCached(currentUser.id);
  if (!respBranches.success) {
    <ShowPageMessage modelName={`Sucursal`} errorMessage={respBranches.message} />;
  }
  if (respBranches.data.length === 0) {
    return <ShowPageMessage customMessage={`No se encontraron sucursales`} />;
  }
  const branchUsers = respBranches.data as BranchUser[];

  console.log("branchUsers:::", branchUsers);

  return (
    <section className="content flex flex-col ">
      <BranchHeader />
      <BranchesUI branchUsers={branchUsers} />
    </section>
  );
}
