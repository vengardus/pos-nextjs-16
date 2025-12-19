import type { Branch } from "@/types/interfaces/branch/branch.interface";
import type { Category } from "@/types/interfaces/category/category.interface";
import type { Product } from "@/types/interfaces/product/product.interface";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { ListDef } from "./components/list-def";
import { categoryGetAllByCompanyCached } from "@/server/modules/category/next/cache/category.cache";
import { productGetAllByCompanyCached } from "@/lib/data/products/product.cache";
import { branchGetAllByCompanyCached } from "@/lib/data/branches/branch.cache";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";

export default async function ConfigProductsPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.products
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // obtener categories
  const respCategories = await categoryGetAllByCompanyCached(company.id);
  if (!respCategories.success) {
    return (
      <ShowPageMessage
        modelName={`Categoría de productos`}
        errorMessage={respCategories.message}
      />
    );
  }
  const categories = respCategories.data as Category[];

  // obtener products
  const respProducts = await productGetAllByCompanyCached(company.id);
  if (!respProducts.success) {
    return <ShowPageMessage modelName={`Productos`} errorMessage={respProducts.message} />;
  }
  const products = respProducts.data as Product[];

  // obtener sucursales
  const respBranches = await branchGetAllByCompanyCached(company.id);
  if (!respBranches.success) {
    return <ShowPageMessage modelName={`Sucursales`} errorMessage={respBranches.message} />;
  }
  const branches = respBranches.data as Branch[];

  return (
    <ListDef
      data={{
        products,
        categories,
        branches,
      }}
      companyId={company.id}
    />
  );
}
