import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SummaryTopSellingProducts } from "@/server/modules/dashboard/domain/dashboard.summary-top-selling-products.interface";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { saleGetTopSellingProductsCached } from "@/server/modules/sale/next/cache/sale.get-top-selling-products.cache";
import { Package, TrendingUp } from "lucide-react";

interface TopProductsByQuantityProps {
  companyId: string;
  itemsByQuantity?: number;
}
export const TopProductsByQuantity = async ({
  companyId,
  itemsByQuantity = 5,
}: TopProductsByQuantityProps) => {
  // get top selling products
  const respTopSellingProducts = await saleGetTopSellingProductsCached(
    companyId
  );
  if (!respTopSellingProducts.success) {
    return (
      <ShowPageMessage
        customMessage={`Productos mas vendidos`}
        errorMessage={respTopSellingProducts.message}
      />
    );
  }
  const topSellingProducts =
    respTopSellingProducts.data as SummaryTopSellingProducts;
  const topProducts = topSellingProducts.topByQuantity;

  // Find max quantity to calculate progress bars
  const maxQuantity = topProducts.length > 0 
    ? Math.max(...topProducts.map(p => p.accumulated)) 
    : 1;

  return (
    <Card className="h-full border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col">
      <CardHeader className="p-6 border-b border-border/40 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <TrendingUp size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight">Top {itemsByQuantity}</CardTitle>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Por cantidad vendida</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 overflow-y-auto">
        {!respTopSellingProducts.success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-full">
              <Package size={32} />
            </div>
            <p className="text-sm font-medium text-rose-600">Error al obtener datos</p>
            <p className="text-xs text-muted-foreground max-w-[200px]">{respTopSellingProducts.message}</p>
          </div>
        ) : topProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3 opacity-40">
            <Package size={48} className="text-muted-foreground" />
            <p className="text-sm font-medium">No hay datos disponibles</p>
          </div>
        ) : (
          <div className="space-y-6">
            {topProducts.map((product, index) => (
              <div key={index} className="space-y-2 group transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-black text-primary/40 group-hover:text-primary transition-colors">
                      #{(index + 1).toString().padStart(2, '0')}
                    </span>
                    <p className="text-sm font-semibold truncate text-foreground/80 group-hover:text-foreground transition-colors">
                      {product.name}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-primary/5 px-2 py-1 rounded text-primary">
                    {product.accumulated} uds.
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--primary),0.2)]"
                    style={{ width: `${(product.accumulated / maxQuantity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
