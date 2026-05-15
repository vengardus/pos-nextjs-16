import "server-only";
import { unstable_cache as cache } from "next/cache";
import { productGetByBarcodeUseCase } from "../../use-cases/product.get-by-barcode.use-case";

export async function productGetByBarcodeCached(barcode: string, companyId: string) {
  const fn = cache(
    async () => productGetByBarcodeUseCase(barcode, companyId),
    [`product-barcode-${barcode}-${companyId}`],
    {
      revalidate: 3600,
      tags: ["products"],
    }
  );
  return fn();
}
