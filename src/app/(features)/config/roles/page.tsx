import { ListDef } from "@/app/(features)/config/roles/components/list-def";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { PageHeader } from "@/components/common/typography/page-header";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { roleGetAllByCompanyCached } from "@/server/modules/role/next/cache/role.cache";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { mapNavbarItemsToModules } from "@/server/modules/permission/utils/module.mapper";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function RolesPage(props: {
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
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.roles);
  if (!authenticatationAndPermissionResponse.isAuthenticated || !authenticatationAndPermissionResponse.company)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company;

  // obtener roles y módulos
  const [respRoles, modules] = await Promise.all([
    roleGetAllByCompanyCached(
      company.id,
      page,
      AppConstants.DEFAULT_PAGE_SIZE,
      search
    ),
    mapNavbarItemsToModules()
  ]);

  if (!respRoles.success) {
    return <ShowPageMessage modelName={"Roles"} errorMessage={respRoles.message} />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader breadcrumb="Config / Roles" title="" backRoute="/config" />
      </div>
      <div className="flex-1 overflow-hidden">
        <ListDef 
          data={respRoles.data ?? []} 
          companyId={company.id} 
          modules={modules}
          pagination={respRoles.pagination}
        />
      </div>
    </div>
  );
}
