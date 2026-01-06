import { cn } from "@/utils/tailwind/cn";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type {
  CashRegisterMovementTotal,
  CashRegisterMovementTotalSummary,
} from "@/server/modules/cash-register-movement/domain/cash-register-movement-total-summary.interface";
import { CashRegisterMovementTypeEnum } from "@/server/modules/cash-register-movement/domain/cash-register-movement-type.enum";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { RegisterClosureUI } from "@/app/(features)/cash-register/closure/[id]/components/register-closure-ui";
import { RegisterClosureHeaderDate } from "@/app/(features)/cash-register/closure/[id]/components/register-closure-header-date";
import { CashRegisterStatusEnum } from "@/server/modules/cash-register/domain/cash-register.types";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { ModuleEnum } from "@/server/modules/permission/domain/permission.module.enum";
import { LinkSS } from "@/components/common/links/link-ss";
import { paymentMethodGetAllByCompanyCached } from "@/server/modules/payment-method/next/cache/payment-method.cache";
import { cashRegisterClosureGetByIdCached } from "@/server/modules/cash-register-closure/next/cache/cash-register-closure.cache";
import { cashRegisterMovementGetTotalsCached } from "@/server/modules/cash-register-movement/next/cache/cash-register-movement.get-totals.cache";

type Params = Promise<{ id: string }>;

export default async function CashRegisterClosurePage({ params }: { params: Params }) {
  const { id: cashRegisterClosureId } = await params;

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
  const data = respTotals.data as CashRegisterMovementTotal;
  const totals = data.summary;

  if (!respTotals.success) {
    return (
      <ShowPageMessage
        customMessage={`Error al calcular totales para el Cierre de Caja`}
        errorMessage={respTotals.message}
      />
    );
  }

  const getTotalSection = (type: string) => {
    const total = totals.find((t) => t.type === type && t.isAccumulatedTotal && t.code === "");
    return total ? total.amount : 0;
  };

  return (
    <div className="content scr">
      <Card className="card w-full md:w-[90%]">
        <CardHeader className="flex flex-col justify-center items-center gap-3">
          <RegisterClosureHeaderDate dateStart={data.dateStart} dateEnd={data.dateEnd} />
          <LinkSS href="/pos" label="Ir a Ventas" />
        </CardHeader>

        <CardContent className="mt-3">
          <section className="flex justify-around font-bold text-md md:font-extrabold lg:text-xl">
            <div className="flex flex-col md:flex-row gap-1 md:gap-3 items-center">
              <span>Efectivo en Caja:</span>
              <span>S/. {getTotalSection("moneyInRegister").toFixed(2)}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-1 md:gap-3 items-center">
              <span>Ventas Totales:</span>
              <span>S/. {getTotalSection("sales").toFixed(2)}</span>
            </div>
          </section>

          <Separator className="my-10 bg-slate-700" />

          <section className="grid md:grid-cols-2 gap-7">
            <section className="flex flex-col items-center gap-3 w-full lg:w-2/3 mx-auto">
              <h2 className="text-lg lg:text-xl text-center w-full">Dinero en Caja</h2>
              <ShowSectionTotalSummary totals={totals} type="moneyInRegister" />
            </section>

            <section className="flex flex-col items-center gap-3 w-full lg:w-2/3 mx-auto">
              <h2 className="text-lg lg:text-xl text-center w-full">Ventas Totales</h2>
              <ShowSectionTotalSummary totals={totals} type="sales" />
            </section>
          </section>
        </CardContent>

        <CardFooter className="flex justify-center w-full mt-3 mb-12">
          {getTotalSection("moneyInRegister") < 0 ? (
            <div className="flex flex-col gap-1 items-center">
              <div className="text-red-500">
                {`Registro de efectivo en caja es negativo (${(
                  Math.round(getTotalSection("moneyInRegister") * 100) / 100
                ).toFixed(2)}). Corrija ingreso de dinero a caja.`}
              </div>
              <LinkSS
                href={`/cash-register/movement/${CashRegisterMovementTypeEnum.INCOME}`}
                label="Ir a Ingreso de dinero en Caja"
              />
            </div>
          ) : (
            <RegisterClosureUI
              cashRegisterClosureId={cashRegisterClosureId}
              amountInRegister={getTotalSection("moneyInRegister")}
              paymentMethods={paymentMethods}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

interface CashRegisterMovementTotalSummaryProps {
  totals: CashRegisterMovementTotalSummary[];
  type: string;
}
const ShowSectionTotalSummary = ({ totals, type }: CashRegisterMovementTotalSummaryProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {totals
        .filter((total) => total.type === type)
        .map((total) => (
          <div
            key={total.label}
            className={cn("flex justify-beetween w-full", {
              " border-t-2 border-slate-700 my-2": total.isAccumulatedTotal,
            })}
          >
            <span className="flex justify-start md:justify-end lg:justify-start w-full ">
              {total.label}:
            </span>
            <div className="flex w-full gap-5">
              <span className="flex justify-end w-full">S/.</span>
              <span
                className={cn("w-full flex justify-end", {
                  "text-red-400": total.amount < 0,
                })}
              >
                {total.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};
