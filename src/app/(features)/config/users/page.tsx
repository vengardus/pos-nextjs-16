import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ListDef } from "./components/list-def";
import { PageHeader } from "@/components/common/typography/page-header";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { documentTypeGetAllByCompanyCached } from "@/server/modules/document-type/next/cache/document-type.cache";
import { userGetAllByCompanyCached } from "@/server/modules/user/next/cache/user.cache";
import { roleGetAllByCompanyCached } from "@/server/modules/role/next/cache/role.cache";
import { branchGetAllByCompanyCached } from "@/server/modules/branch/next/cache/branch.cache";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function UserConfigPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const rawPage = Number(searchParams?.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const search =
    typeof searchParams?.search === "string" && searchParams.search.trim()
      ? searchParams.search.trim()
      : undefined;

  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(ModuleEnum.users);
  if (!authenticatationAndPermissionResponse.isAuthenticated || !authenticatationAndPermissionResponse.company)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  
  const company = authenticatationAndPermissionResponse.company;

  const [respDocumentTypes, respBranches, respUsers, respRoles] = await Promise.all([
    documentTypeGetAllByCompanyCached(company.id),
    branchGetAllByCompanyCached(company.id),
    userGetAllByCompanyCached(company.id, page, AppConstants.DEFAULT_PAGE_SIZE, search),
    roleGetAllByCompanyCached(company.id),
  ]);

  if (!respDocumentTypes.success) return <ShowPageMessage modelName={"Tipos de documentos"} errorMessage={respDocumentTypes.message} />;
  if (!respBranches.success) return <ShowPageMessage modelName={"Sucursales"} errorMessage={respBranches.message} />;
  if (!respUsers.success) return <ShowPageMessage modelName={"Usuarios"} errorMessage={respUsers.message} />;
  if (!respRoles.success) return <ShowPageMessage modelName={"Roles"} errorMessage={respRoles.message} />;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader breadcrumb="Config / Usuarios" title="" backRoute="/config" />
      </div>
      <div className="flex-1 overflow-hidden">
        <ListDef 
          data={respUsers.data ?? []} 
          companyId={company.id}
          pagination={respUsers.pagination}
          branches={respBranches.data ?? []}
          roles={respRoles.data ?? []}
          documentTypes={respDocumentTypes.data ?? []}
          currentUserId={authenticatationAndPermissionResponse.userId ?? ""}
          currentUserRole={authenticatationAndPermissionResponse.role ?? ""}
        />
      </div>
    </div>
  );
}
