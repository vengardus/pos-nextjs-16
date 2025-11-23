import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/types/enums/module.enum";
import { ClientSupplierList } from "./components/client-supplier-list";
import { clientSupplierGetAllByCompanyCached } from "@/actions/clients-suppliers/cache/client-supplier.cache";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";

export default async function ConfigClientsSuppliersPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.pos
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // obteber clientssuppliers
  const respClientsSuppliers = await clientSupplierGetAllByCompanyCached(company.id);
  if (!respClientsSuppliers.success) {
    return <ShowPageMessage modelName={`Clientes`} errorMessage={respClientsSuppliers.message} />;
  }

  return <ClientSupplierList clientssuppliers={respClientsSuppliers.data} companyId={company.id} />;
}
