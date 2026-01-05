import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { clientSupplierGetAllByCompanyCached } from "@/server/modules/client-supplier/next/cache/client-supplier.get-all-by-company.cache";
import { getModelMetadata } from "@/server/common/model-metadata";
import { ListDef } from "./components/list-def";

export default async function ConfigClientsSuppliersPage() {
  const clientSupplierMetadata = getModelMetadata("clientSupplier");
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.clients
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return (
      <ShowPageMessage
        customMessage={authenticatationAndPermissionResponse.errorMessage}
      />
    );
  const company = authenticatationAndPermissionResponse.company!;

  // obteber clientssuppliers
  const respClientsSuppliers = await clientSupplierGetAllByCompanyCached(
    company.id
  );
  if (!respClientsSuppliers.success) {
    return (
      <ShowPageMessage
        modelName={clientSupplierMetadata.pluralName}
        errorMessage={respClientsSuppliers.message}
      />
    );
  }

  return <ListDef data={respClientsSuppliers.data} companyId={company.id} />;
}
