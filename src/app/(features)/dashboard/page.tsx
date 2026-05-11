import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { Suspense } from "react";
import { SalesPieChart } from "./components/charts/sales-pie-chart";
import { TopProductsByQuantity } from "./components/tops/top-products-by-quantity";
import { DateRangePicker } from "./components/date-range-picker";
import { paymentMethodGetAllByCompanyCached } from "@/server/modules/payment-method/next/cache/payment-method.cache";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { PageHeader } from "@/components/common/typography/page-header";
import { ListCardTotal } from "./components/list-card-total";
import { Activity, BarChart3, Clock } from "lucide-react";

export default async function DashboardPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.pos);
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

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
    <div className="flex min-h-full flex-col p-6 pb-8 bg-[fondocuadros.svg] bg-[length:60%] bg-center [background-repeat:no-repeat]">
      <div className="mb-8">
        <PageHeader 
          title="Dashboard" 
          breadcrumb={[
            { label: "Inicio", href: "/" },
            { label: "Dashboard" }
          ]} 
          actions={
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-background/50 backdrop-blur-sm rounded-full border border-border/50 text-xs font-medium text-muted-foreground shadow-sm">
                <Clock size={14} className="text-primary" />
                <span>Actualizado en tiempo real</span>
              </div>
              <DateRangePicker />
            </div>
          }
        />
      </div>

      <div className="space-y-8">
        {/* Summary Cards Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Activity size={18} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Resumen General</h2>
          </div>
          <ListCardTotal />
        </section>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Column */}
          <section className="lg:col-span-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <BarChart3 size={18} />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Análisis de Ventas</h2>
            </div>
            <div className="flex-1 min-h-[450px]">
              <Suspense fallback={<div className="h-full w-full bg-background/50 rounded-xl animate-pulse border border-border/50 flex items-center justify-center">Cargando gráfico...</div>}>
                <SalesPieChart
                  companyId={company.id}
                  paymentMethods={respPaymentMethods.data}
                />
              </Suspense>
            </div>
          </section>

          {/* Side Panels Column */}
          <section className="lg:col-span-4 flex flex-col gap-8 h-full">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <BarChart3 size={18} />
                <h2 className="text-sm font-semibold uppercase tracking-wider">Top Rendimiento</h2>
              </div>
              <div className="flex-1">
                <Suspense fallback={<div className="h-full w-full bg-background/50 rounded-xl animate-pulse border border-border/50 flex items-center justify-center p-8 text-sm">Cargando ranking...</div>}>
                  <TopProductsByQuantity companyId={company.id} />
                </Suspense>
              </div>
            </div>
          </section>
        </div>

        {/* Optional Secondary Insights Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="p-8 rounded-2xl border border-dashed border-border/60 bg-background/40 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 bg-muted/50 rounded-full text-muted-foreground opacity-40">
              <Activity size={32} />
            </div>
            <p className="text-sm font-medium text-muted-foreground/60 tracking-tight">Movimientos de Caja (tiempo real)</p>
            <p className="text-xs text-muted-foreground/40 italic">Módulo en desarrollo...</p>
          </div>
          <div className="p-8 rounded-2xl border border-dashed border-border/60 bg-background/40 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 bg-muted/50 rounded-full text-muted-foreground opacity-40">
              <BarChart3 size={32} />
            </div>
            <p className="text-sm font-medium text-muted-foreground/60 tracking-tight">TOP 10 Productos por monto</p>
            <p className="text-xs text-muted-foreground/40 italic">Módulo en desarrollo...</p>
          </div>
        </section>
      </div>
    </div>
  );
}
