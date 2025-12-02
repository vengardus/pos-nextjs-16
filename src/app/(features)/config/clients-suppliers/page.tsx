import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";
import { clientSupplierGetAllByCompanyCached } from "@/lib/data/clients-suppliers/client-supplier.cache";
import { ClientSupplierBusiness } from "@/business/client-supplier.business";
import { ListDef } from "./components/list-def";

export default async function ConfigClientsSuppliersPage() {
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
        modelName={ClientSupplierBusiness.metadata.pluralName}
        errorMessage={respClientsSuppliers.message}
      />
    );
  }

  return <ListDef data={respClientsSuppliers.data} companyId={company.id} />;
}
