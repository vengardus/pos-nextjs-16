import { ListDef } from "@/app/(features)/config/categories/components/list-def";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { PageHeader } from "@/components/common/typography/page-header";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { categoryGetAllByCompanyCached } from "@/server/modules/category/next/cache/category.cache";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function ConfigCategoriesPage(props: {
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
    await checkAuthenticationAndPermission(
    ModuleEnum.productCategories
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

  const respCategories = await categoryGetAllByCompanyCached(
    company.id,
    page,
    AppConstants.DEFAULT_PAGE_SIZE,
    search
  );
  
  if (!respCategories.success) {
    return (
      <ShowPageMessage
        modelName="Categorías"
        errorMessage={respCategories.message}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader breadcrumb="Config / Categorías" title="" backRoute="/" />
      </div>
      <div className="flex-1 overflow-hidden">
        <ListDef 
          data={respCategories.data ?? []} 
          companyId={company.id} 
          pagination={respCategories.pagination}
        />
      </div>
    </div>
  );
}
