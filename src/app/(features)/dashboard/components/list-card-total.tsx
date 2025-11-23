import { CurrencyIcon } from "lucide-react";
import { CardTotal } from "./card-total";

export const ListCardTotal = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      <CardTotal
        title="Ventas"
        value={(125.0).toFixed(2)}
        note="+ 10% del periodo anterior."
      >
        <CurrencyIcon />
      </CardTotal>

      <CardTotal title="Clientes" value={"15"} note="+5% del periodo anterior.">
        <CurrencyIcon />
      </CardTotal>

      <CardTotal title="Productos" value={"12"} note="+7% del periodo anterior.">
        <CurrencyIcon />
      </CardTotal>
    </div>
  );
};
