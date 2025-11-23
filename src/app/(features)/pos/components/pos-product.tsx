import { productGetAllByCompanyCached } from "@/lib/data/products/product.cache";
import { PosProductUI } from "./pos-product-ui";

interface PosProductProps {
  companyId: string;
}

export const PosProduct = async ({ companyId }: PosProductProps) => {
  const resp = await productGetAllByCompanyCached(companyId);

  if (!resp.success) return <div>Error al obtener productos</div>;
  return <PosProductUI products={resp.data} />;
};
