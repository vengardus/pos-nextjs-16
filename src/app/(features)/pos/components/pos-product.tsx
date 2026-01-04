import { productGetAllByCompanyCached } from "@/server/modules/product/next/cache/product.get-all-by-company.cache";
import { PosProductUI } from "./pos-product-ui";

interface PosProductProps {
  companyId: string;
}

export const PosProduct = async ({ companyId }: PosProductProps) => {
  const resp = await productGetAllByCompanyCached(companyId);

  if (!resp.success) return <div>Error al obtener productos</div>;
  return <PosProductUI products={resp.data} />;
};
