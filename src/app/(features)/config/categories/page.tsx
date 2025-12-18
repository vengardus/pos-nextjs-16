import { ListDef } from "@/app/(features)/config/categories/components/list-def";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { categoryGetAllByCompanyCached } from "@/server/category/next/cache/category.cache";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";

export default async function ConfigCategoriesPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.productCategories
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // obteber categories
  const respCategories = await categoryGetAllByCompanyCached(company.id);
  if (!respCategories.success) {
    return (
      <ShowPageMessage
        modelName={`Categoría de productos`}
        errorMessage={respCategories.message}
      />
    );
  }

  return <ListDef data={respCategories.data} companyId={company.id} />;
}
