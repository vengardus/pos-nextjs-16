import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ListDef } from "@/app/(features)/config/payment-methods/components/list-def";
import { PageHeader } from "@/components/common/typography/page-header";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { paymentMethodGetAllByCompanyCached } from "@/server/modules/payment-method/next/cache/payment-method.cache";
import { AppConstants } from "@/shared/constants/app.constants";

export default async function ConfigPaymentMethodsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const rawPage = Number(searchParams?.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const search =
    typeof searchParams?.search === "string" && searchParams.search.trim()
      ? searchParams.search.trim()
      : undefined;

  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.paymentMethods);
  if (!authenticatationAndPermissionResponse.isAuthenticated || !authenticatationAndPermissionResponse.company)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  
  const company = authenticatationAndPermissionResponse.company;

  const respPaymentMethods = await paymentMethodGetAllByCompanyCached(
    company.id,
    page,
    AppConstants.DEFAULT_PAGE_SIZE,
    search
  );
  if (!respPaymentMethods.success) {
    return (
      <ShowPageMessage
        modelName={`Metodos de pago`}
        errorMessage={respPaymentMethods.message}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 px-4">
        <PageHeader breadcrumb="Config / Métodos de Pago" title="" backRoute="/config" />
      </div>
      <div className="flex-1 overflow-hidden">
        <ListDef 
          data={respPaymentMethods.data ?? []} 
          companyId={company.id} 
          pagination={respPaymentMethods.pagination} 
        />
      </div>
    </div>
  );
}
