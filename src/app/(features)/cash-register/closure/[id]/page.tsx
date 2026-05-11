import { cn } from "@/utils/tailwind/cn";
import { Card } from "@/components/ui/card";

import type {
  CashRegisterMovementTotal,
  CashRegisterMovementTotalSummary,
} from "@/server/modules/cash-register-movement/domain/cash-register-movement-total-summary.interface";
import { CashRegisterMovementTypeEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-type.enum";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { RegisterClosureUI } from "@/app/(features)/cash-register/closure/[id]/components/register-closure-ui";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { paymentMethodGetAllByCompanyCached } from "@/server/modules/payment-method/next/cache/payment-method.cache";
import { cashRegisterClosureGetByIdCached } from "@/server/modules/cash-register-closure/next/cache/cash-register-closure.cache";
import { cashRegisterMovementGetTotalsCached } from "@/server/modules/cash-register-movement/next/cache/cash-register-movement.get-totals.cache";
import { PageHeader } from "@/components/common/typography/page-header";
import { format } from "date-fns";
import { Wallet, ShoppingCart, Calculator, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function CashRegisterClosurePage({ params }: { params: Params }) {
  const { id: cashRegisterClosureId } = await params;

  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.pos);
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  // verificar cash-register-closure exista y este aperturada
  const respCashRegisterClosure = await cashRegisterClosureGetByIdCached(cashRegisterClosureId);
  if (!respCashRegisterClosure.success || !respCashRegisterClosure.data) {
    return (
      <ShowPageMessage
        customMessage={`Error: Caja aperturada no encontrada`}
        errorMessage={respCashRegisterClosure.message}
      />
    );
  }
  if (respCashRegisterClosure.data.status === CashRegisterStatusEnum.CLOSING) {
    return <ShowPageMessage customMessage={`Error: Caja ya fue cerrada.`} />;
  } else if (respCashRegisterClosure.data.status !== CashRegisterStatusEnum.OPENING) {
    return (
      <ShowPageMessage
        customMessage={`Error: Caja no aperturada`}
        errorMessage={respCashRegisterClosure.message}
      />
    );
  }

  // obtener metodos de pago
  const respPaymentMethods = await paymentMethodGetAllByCompanyCached(company.id);
  if (!respPaymentMethods.success) {
    return (
      <ShowPageMessage errorMessage={respPaymentMethods.message} modelName="Metodos de Pago" />
    );
  }
  const paymentMethods = respPaymentMethods.data;

  const respTotals = await cashRegisterMovementGetTotalsCached({
    typeQuery: "by-cash-register-closure-id",
    cashRegisterClosureId,
    paymentMethods,
  });
  
  if (!respTotals.success) {
    return (
      <ShowPageMessage
        customMessage={`Error al calcular totales para el Cierre de Caja`}
        errorMessage={respTotals.message}
      />
    );
  }

  const data = respTotals.data as CashRegisterMovementTotal;
  const totals = data.summary;

  const getTotalSection = (type: string) => {
    const total = totals.find((t) => t.type === type && t.isAccumulatedTotal && t.code === "");
    return total ? total.amount : 0;
  };

  const cashInRegister = getTotalSection("moneyInRegister");
  const totalSales = getTotalSection("sales");

  return (
    <div className="flex h-full flex-col p-6 bg-[fondocuadros.svg] bg-[length:60%] bg-center [background-repeat:no-repeat] overflow-hidden">
      <div className="mb-4">
        <PageHeader 
          title="Cierre de Caja" 
          backRoute="/pos"
          breadcrumb={[
            { label: "Punto de Venta", href: "/pos" },
            { label: "Cierre de Caja" }
          ]} 
          actions={
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 text-xs font-medium text-muted-foreground shadow-sm">
              <Calendar size={14} className="text-primary" />
              <span>{format(data.dateStart, "dd/MM/yyyy HH:mm")}</span>
              <span className="opacity-40 px-1">→</span>
              <span>{format(data.dateEnd, "dd/MM/yyyy HH:mm")}</span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Resumen Principal */}
        <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden shrink-0">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calculator size={20} />
                </div>
                <h3 className="font-semibold text-foreground">Resumen de Turno</h3>
              </div>
              <div className="space-y-4 mt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Efectivo Esperado</span>
                  <span className={cn("text-3xl font-bold tracking-tight", cashInRegister < 0 ? "text-rose-500" : "text-foreground")}>
                    S/. {cashInRegister.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ventas Totales</span>
                  <span className="text-2xl font-semibold text-emerald-500">
                    S/. {totalSales.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {cashInRegister < 0 ? (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                    <div className="space-y-2">
                      <p className="text-sm text-rose-700 dark:text-rose-300 font-medium leading-snug">
                        El efectivo en caja es negativo.
                      </p>
                      <Link 
                        href={`/cash-register/movement/${CashRegisterMovementTypeEnum.INCOME}`}
                        className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline gap-1"
                      >
                        Corregir con un Ingreso →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground leading-relaxed italic text-center">
                      Revise los detalles de los movimientos antes de proceder con el cierre definitivo del turno.
                    </p>
                  </div>
                  <RegisterClosureUI
                    cashRegisterClosureId={cashRegisterClosureId}
                    amountInRegister={cashInRegister}
                    paymentMethods={paymentMethods}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Detalles de Movimientos */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-hidden">
          <Card className="flex flex-col border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden h-full">
            <div className="p-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <Wallet size={16} className="text-primary" />
              <h3 className="font-semibold text-sm">Dinero en Caja</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <ShowSectionTotalSummary totals={totals} type="moneyInRegister" />
            </div>
          </Card>

          <Card className="flex flex-col border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden h-full">
            <div className="p-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <ShoppingCart size={16} className="text-primary" />
              <h3 className="font-semibold text-sm">Ventas Totales</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <ShowSectionTotalSummary totals={totals} type="sales" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface CashRegisterMovementTotalSummaryProps {
  totals: CashRegisterMovementTotalSummary[];
  type: string;
}
const ShowSectionTotalSummary = ({ totals, type }: CashRegisterMovementTotalSummaryProps) => {
  return (
    <div className="space-y-3">
      {totals
        .filter((total) => total.type === type)
        .map((total) => (
          <div
            key={total.label}
            className={cn("flex flex-col gap-1 transition-colors p-2 rounded-lg", {
              "bg-primary/5 mt-4 pt-4 border-t-2 border-primary/20 shadow-[0_-1px_0_rgba(0,0,0,0.05)]": total.isAccumulatedTotal,
              "hover:bg-muted/50": !total.isAccumulatedTotal
            })}
          >
            <div className="flex justify-between items-center">
              <span className={cn("text-xs", total.isAccumulatedTotal ? "font-bold text-foreground uppercase tracking-wider" : "text-muted-foreground font-medium")}>
                {total.label}
              </span>
              <span className={cn("font-mono text-sm", {
                "text-lg font-bold text-foreground": total.isAccumulatedTotal,
                "text-rose-500 font-semibold": total.amount < 0 && !total.isAccumulatedTotal,
                "text-foreground/80": total.amount >= 0 && !total.isAccumulatedTotal
              })}>
                S/. {total.amount.toFixed(2)}
              </span>
            </div>
            {total.isAccumulatedTotal && (
              <div className="h-0.5 w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full" />
            )}
          </div>
        ))}
    </div>
  );
};
