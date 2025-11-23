import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { CashRegisterMovementTypeEnum } from "@/types/enums/cash-register-movement-type.enum";
import { RegisterMovementForm } from "@/app/(features)/cash-register/movement/[type]/components/register-movement-form";
import { LinkSS } from "@/components/common/links/link-ss";
import { Title } from "@/components/common/titles/Title";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";

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

  return (
    <div className="content">
      <Card className="card w-full md:w-1/2 lg:w-1/3">
        <CardHeader className="flex flex-col justify-center items-center gap-3">
          <Title
            label={
              movementType == CashRegisterMovementTypeEnum.INCOME
                ? "Ingreso en Caja"
                : "Retiro de Caja"
            }
          ></Title>
          <LinkSS href="/pos" label="Ir a Ventas" />
        </CardHeader>
        <CardContent>
          <RegisterMovementForm movementType={movementType} />
        </CardContent>
      </Card>
    </div>
  );
}
