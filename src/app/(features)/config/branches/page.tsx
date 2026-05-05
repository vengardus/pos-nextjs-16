import type { BranchUser } from "@/server/modules/branch-user/domain/branch-user.interface";
import { BranchesUI } from "@/app/(features)/config/branches/components/branches-ui";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { branchUserGetAllByUserCached } from "@/server/modules/branch-user/next/cache/branch-user.cache";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { PageHeader } from "@/components/common/typography/page-header";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function BranchesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const rawPage = Number(searchParams?.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const search =
    typeof searchParams?.search === "string" && searchParams.search.trim()
      ? searchParams.search.trim()
      : undefined;

  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.pos
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated || !authenticatationAndPermissionResponse.company)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  
  const company = authenticatationAndPermissionResponse.company;
  const currentUser = {
    id: authenticatationAndPermissionResponse.userId!,
    userName: authenticatationAndPermissionResponse.userName!,
    role: authenticatationAndPermissionResponse.role!,
  };

  // obtener sucursales del usuario
  const respBranches = await branchUserGetAllByUserCached(
    currentUser.id,
    page,
    AppConstants.DEFAULT_PAGE_SIZE,
    search
  );

  if (!respBranches.success) {
    return <ShowPageMessage modelName={`Sucursal`} errorMessage={respBranches.message} />;
  }
  
  const branchUsers = respBranches.data as BranchUser[];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader breadcrumb="Config / Sucursales" title="" backRoute="/config" />
      </div>
      <div className="flex-1 overflow-auto p-4 pt-0">
        <BranchesUI 
          branchUsers={branchUsers} 
          companyId={company.id}
          pagination={respBranches.pagination}
        />
      </div>
    </div>
  );
}
