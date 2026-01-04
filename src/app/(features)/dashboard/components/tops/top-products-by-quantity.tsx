import { cn } from "@/utils/tailwind/cn";
import { Card } from "@/components/ui/card";
import type { SummaryTopSellingProducts } from "@/types/interfaces/dashboard/summary-top-selling-products.interface";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { Title } from "@/components/common/titles/Title";
import { saleGetTopSellingProductsCached } from "@/server/modules/sale/next/cache/sale.get-top-selling-products.cache";

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
        customMessage={`Prodcutos mas vendidos`}
        errorMessage={respTopSellingProducts.message}
      />
    );
  }
  const topSellingProducts =
    respTopSellingProducts.data as SummaryTopSellingProducts;
  const topProducts = topSellingProducts.topByQuantity;

  return (
    <Card className="py-2 px-3 card">
      <Title label={`TOP ${itemsByQuantity}`}></Title>
      <p className="text-center text-sm">Productos mas vendidos por cantidad</p>
      {!respTopSellingProducts.success ? (
        <div className="flex justify-center my-7 w-full text-red-500">
          Ocurrió un error al obtener productos mas vendidos:{" "}
          {respTopSellingProducts.message}
        </div>
      ) : (
        <section className="grid mt-2 gap-2">
          <section className="grid grid-cols-2 border-b-2 border-slate-700">
            <p>Producto</p>
            <p className="text-center">Cantidad</p>
          </section>
          <section className="">
            {topProducts.length === 0 ? (
              <div className="text-center w-full">No hay productos</div>
            ) : (
              topProducts.map((product, index) => {
                return (
                  <article
                    key={index}
                    className={cn("grid grid-cols-2 pb-2", {
                      "bg-gray-800": index % 2 !== 0,
                    })}
                  >
                    <p className="pl-1">{product.name}</p>
                    <p className="text-center">{product.accumulated}</p>
                  </article>
                );
              })
            )}
          </section>
        </section>
      )}
    </Card>
  );
};
