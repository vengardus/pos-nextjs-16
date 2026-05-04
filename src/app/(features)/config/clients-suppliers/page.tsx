import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { PageHeader } from "@/components/common/typography/page-header";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { clientSupplierGetAllByCompanyCached } from "@/server/modules/client-supplier/next/cache/client-supplier.get-all-by-company.cache";
import { AppConstants } from "@/shared/constants/app.constants";
import { ListDef } from "./components/list-def";

export default async function ConfigClientsSuppliersPage(props: {
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
    ModuleEnum.clients
  );
  if (
    !authenticatationAndPermissionResponse.isAuthenticated ||
    !authenticatationAndPermissionResponse.company
  ) {
    return (
      <ShowPageMessage
        customMessage={authenticatationAndPermissionResponse.errorMessage}
      />
    );
  }
  const company = authenticatationAndPermissionResponse.company;

  // obtener clientssuppliers
  const respClientsSuppliers = await clientSupplierGetAllByCompanyCached(
    company.id,
    page,
    AppConstants.DEFAULT_PAGE_SIZE,
    search
  );

  if (!respClientsSuppliers.success) {
    return (
      <ShowPageMessage
        modelName="Clientes y Proveedores"
        errorMessage={respClientsSuppliers.message}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader
          breadcrumb="Config / Clientes y Proveedores"
          title=""
          backRoute="/config"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <ListDef
          data={respClientsSuppliers.data ?? []}
          companyId={company.id}
          pagination={respClientsSuppliers.pagination}
        />
      </div>
    </div>
  );
}
