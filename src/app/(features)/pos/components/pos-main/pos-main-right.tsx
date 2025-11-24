import { clientSupplierGetAllByCompanyCached } from "@/lib/data/clients-suppliers/client-supplier.cache";
import { PosMainButtons } from "./pos-main-right/pos-main-buttons";
import { PosMainTotals } from "./pos-main-right/pos-main-totals";
import { paymentMethodGetAllByCompanyCached } from "@/actions/payment-methods/cache/payment-method.cache";

interface PosMainRightProps {
  companyId: string;
}

export const PosMainRight = async ({ companyId }: PosMainRightProps) => {
  const [respPaymentMethoss, respClientsSuppliers] = await Promise.all([
    paymentMethodGetAllByCompanyCached(companyId),
    clientSupplierGetAllByCompanyCached(companyId),
  ]);

  if (!respPaymentMethoss.success)
    return <div>Error al obtener metodos de pago</div>;
  if (!respClientsSuppliers.success || respClientsSuppliers.data.length === 0)
    return <div>Error al obtener clientes</div>;

  return (
    <div className="flex flex-col h-full w-full p-2 gap-5 border rounded-xl  border-gray-500">
      <PosMainButtons
        paymentMethods={respPaymentMethoss.data}
        clientsSuppliers={respClientsSuppliers.data}
      />
      <PosMainTotals />
    </div>
  );
};
