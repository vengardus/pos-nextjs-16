import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { Title } from "@/components/common/titles/Title";
import { ModuleEnum } from "@/types/enums/module.enum";
import { Suspense } from "react";
import { SalesPieChart } from "./components/charts/sales-pie-chart";
import { TopProductsByQuantity } from "./components/tops/top-products-by-quantity";
import { DateRangePicker } from "./components/date-range-picker";
import { paymentMethodGetAllByCompanyCached } from "@/lib/data/payment-methods/payment-method.cache";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";

export default async function DashboardPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.pos);
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;
  // const currentUser = {
  //   id: authenticatationAndPermissionResponse.userId!,
  //   userName: authenticatationAndPermissionResponse.userName!,
  //   role: authenticatationAndPermissionResponse.role!,
  // };

  // obtener metodos de pago
  const respPaymentMethods = await paymentMethodGetAllByCompanyCached(company.id);
  if (!respPaymentMethods.success || respPaymentMethods.data.length === 0) {
    return (
      <ShowPageMessage
        modelName={`Metodos de pago`}
        errorMessage={respPaymentMethods.message}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-6xl mx-auto gap-5 px-3 xl:px-0 py-3">
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[20%_80%]  ">
        <Title label="Dashboard" className="text-left" />
        <DateRangePicker />
      </section>

      <section className="grid grid-cols-1 gap-5  md:grid-cols-[60%_40%]  lg:grid-cols-[70%_30%] pb-7">
        <section className="grid grid-cols-1 gap-3">
          {/* <ListCardTotal /> */}
          <div className=" order-first ">
            <Suspense fallback={<div>Loading...</div>}>
              <SalesPieChart
                companyId={company.id}
                paymentMethods={respPaymentMethods.data}
              />
            </Suspense>
          </div>
        </section>
        <Suspense fallback={<div>Loading...</div>}>
          <TopProductsByQuantity companyId={company.id} />
        </Suspense>

        <section className="md:col-span-2 grid grid-cols-1 md:grid-cols-[50%_50%] gap-3">
          <div>Movimientos de Caja (tiempo real)</div>
          <div>TOP 10 Productos mas vendidos por monto</div>
        </section>
      </section>
    </div>
  );
}
