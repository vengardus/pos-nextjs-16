import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ListDef } from "@/app/(features)/config/payment-methods/components/list-def";
import { ModuleEnum } from "@/types/enums/module.enum";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";
import { paymentMethodGetAllByCompanyCached } from "@/server/modules/payment-method/next/cache/payment-method.cache";

export default async function ConfigPaymentMethodsPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.paymentMethods);
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // obteber payment methods
  const respPaymentMethods = await paymentMethodGetAllByCompanyCached(company.id);
  if (!respPaymentMethods.success) {
    return (
      <ShowPageMessage
        modelName={`Metodos de pago`}
        errorMessage={respPaymentMethods.message}
      />
    );
  }

  return <ListDef data={respPaymentMethods.data} companyId={company.id} />;
}
