import { DollarSign, Users, Package } from "lucide-react";
import { CardTotal } from "./card-total";

export const ListCardTotal = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardTotal
        title="Ventas Totales"
        value={`S/. ${(1254.50).toFixed(2)}`}
        note="+ 12.5% vs periodo anterior"
        trend="up"
      >
        <DollarSign size={20} />
      </CardTotal>

      <CardTotal 
        title="Nuevos Clientes" 
        value={"24"} 
        note="+8.2% vs periodo anterior"
        trend="up"
      >
        <Users size={20} />
      </CardTotal>

      <CardTotal 
        title="Productos Activos" 
        value={"142"} 
        note="Inventario actualizado"
        trend="neutral"
      >
        <Package size={20} />
      </CardTotal>
    </div>
  );
};
