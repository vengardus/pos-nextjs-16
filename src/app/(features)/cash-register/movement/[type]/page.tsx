import { Card, CardContent } from "@/components/ui/card";
import { CashRegisterMovementTypeEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-type.enum";
import { RegisterMovementForm } from "@/app/(features)/cash-register/movement/[type]/components/register-movement-form";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { PageHeader } from "@/components/common/typography/page-header";
import { ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";

type Params = Promise<{ type: string }>;
export default async function CashRegisterMovementPage({
  params,
}: {
  params: Params;
}) {
  const { type: movementType } = await params;

  if (
    ![
      CashRegisterMovementTypeEnum.INCOME,
      CashRegisterMovementTypeEnum.EXPENSE,
      "",
    ].includes(movementType)
  ) {
    return (
      <ShowPageMessage
        customMessage={`Error: Tipo de movimiento no válido`}
      ></ShowPageMessage>
    );
  }

  const isIncome = movementType === CashRegisterMovementTypeEnum.INCOME;
  const title = isIncome ? "Ingreso de Efectivo" : "Retiro de Efectivo";

  return (
    <div className="flex min-h-full flex-col p-3 pb-8 bg-[fondocuadros.svg] bg-[length:60%] bg-center [background-repeat:no-repeat]">
      <div className="mb-8">
        <PageHeader 
          title={title} 
          backRoute="/pos"
          breadcrumb={[
            { label: "Punto de Venta", href: "/pos" },
            { label: title }
          ]} 
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-lg border border-border/50 bg-background/80 backdrop-blur-sm shadow-xl">
          <div className="relative overflow-hidden p-6 text-center border-b border-border/40">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
              {isIncome ? <TrendingUp size={120} /> : <TrendingDown size={120} />}
            </div>
            
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-inner ${isIncome ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"}`}>
              <ArrowLeftRight size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isIncome 
                ? "Registre una entrada de dinero a la caja actual." 
                : "Registre una salida de dinero de la caja actual."}
            </p>
          </div>
          
          <CardContent className="p-8">
            <RegisterMovementForm movementType={movementType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
