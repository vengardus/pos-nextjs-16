import { ListDef } from "@/app/(features)/config/products/components/list-def";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { PageHeader } from "@/components/common/typography/page-header";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { productGetAllByCompanyCached } from "@/server/modules/product/next/cache/product.get-all-by-company.cache";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function ConfigProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const rawPage = Number(searchParams?.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const search =
    typeof searchParams?.search === "string" && searchParams.search.trim()
      ? searchParams.search.trim()
      : undefined;

  const authenticatationAndPermissionResponse =
    await checkAuthenticationAndPermission(ModuleEnum.products);
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

  const respProducts = await productGetAllByCompanyCached(
    company.id,
    page,
    AppConstants.DEFAULT_PAGE_SIZE,
    search
  );

  if (!respProducts.success) {
    return (
      <ShowPageMessage
        modelName="Productos"
        errorMessage={respProducts.message}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader
          breadcrumb="Config / Productos"
          title=""
          backRoute="/config"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <ListDef
          data={respProducts.data ?? []}
          companyId={company.id}
          pagination={respProducts.pagination}
        />
      </div>
    </div>
  );
}
