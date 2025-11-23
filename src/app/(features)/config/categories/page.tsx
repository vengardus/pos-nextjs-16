import { CategoryList } from "@/app/(features)/config/categories/components/category-list";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { categoryGetAllByCompanyCached } from "@/actions/categories/cache/category.cache";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";

export default async function ConfigCategoriesPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.pos
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // obteber categories
  const respCategories = await categoryGetAllByCompanyCached(company.id);
  if (!respCategories.success) {
    return (
      <ShowPageMessage modelName={`Categorìa de productos`} errorMessage={respCategories.message} />
    );
  }

  return <CategoryList categories={respCategories.data} companyId={company.id} />;
}
