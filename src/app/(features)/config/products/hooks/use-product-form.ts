import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Product } from "@/types/interfaces/product/product.interface";
import type { ProductStock } from "@/types/interfaces/product/product-stock.interface";
import type { Warehouse } from "@/types/interfaces/warehouse/warehouse.interface";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { ProductBusiness } from "@/business/product.business";
import { WarehouseBusiness } from "@/business/warehouse.business";
import {
  ProductFormSchema,
  ProductFormSchemaType,
} from "@/app/(features)/config/products/schemas/product-form.schema";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import { generateSKU } from "@/utils/generate/generate-sku";
import { formatOptionalField } from "@/utils/formatters/format-optional-field";
import { productInsertOrUpdate } from "@/actions/products/product.insert-or-update.action";
import { warehouseInsertMany } from "@/actions/warehouses/warehouse.insert-many.action";
import { warehouseGetAllByProductAction } from "@/actions/warehouses/warehouse.get-all-by-product.action";

const defaultValues: ProductFormSchemaType = {
  name: "",
  salePrice: 0,
  purchasePrice: 0,
  barcode: "",
  internalCode: generateSKU(),
  isInventoryControl: false,
  isMultiPrice: false,
  categoryId: "",
  branchId: "",
  stock: 0,
  minimunStock: 0,
};

interface UseProductFormProps {
  currentProduct: Product | null;
  companyId: string;
}
export const useProductForm = ({
  currentProduct,
  companyId,
}: UseProductFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [messageGeneralError, setMessageGeneralError] = useState<string | null>(
    null
  );
  const isNewRecord = !currentProduct;
  const [productStocks, setProductStocks] = useState<ProductStock[]>([]);
  const [isOpenDialogInfo, setIsOpenDialogInfo] = useState(false);

  const form = useForm<ProductFormSchemaType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(
      isNewRecord
        ? defaultValues
        : {
            name: currentProduct!.name,
            salePrice: currentProduct!.salePrice,
            purchasePrice: currentProduct!.purchasePrice,
            barcode: currentProduct!.barcode ?? "",
            internalCode: currentProduct!.internalCode ?? "",
            isInventoryControl: currentProduct!.isInventoryControl,
            isMultiPrice: currentProduct!.isMultiPrice,
            categoryId: currentProduct!.categoryId,
          }
    );
  }, [isNewRecord, currentProduct, form]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isNewRecord && currentProduct!.isInventoryControl) {
        const resp = await warehouseGetAllByProductAction(currentProduct!.id);
        if (!resp.success) {
          toast.error(
            `Error: No se pudo obtener stock de ${WarehouseBusiness.metadata.singularName}`
          );
          return;
        }
        const productStocks: ProductStock[] = resp.data.map(
          (warehouse: Warehouse & { Branch: Branch }) => {
            return {
              stock: warehouse.stock,
              minimunStock: warehouse.minimumStock,
              branchId: warehouse.branchId,
              branchLabel: warehouse.Branch.name,
              productId: currentProduct!.id,
            };
          }
        );
        setProductStocks(productStocks);
      }
    };

    fetchData();
  }, [isNewRecord, currentProduct]);

  const handleSave = async (
    values: ProductFormSchemaType,
    productStocks: ProductStock[]
  ) => {
    values.name = toCapitalize(values.name);

    setIsPending(true);

    const product: Product = isNewRecord
      ? {
          id: "",
          name: values.name,
          companyId: companyId,
          barcode: formatOptionalField(values.barcode),
          internalCode: formatOptionalField(values.internalCode),
          unitSale: "",
          salePrice: values.salePrice,
          purchasePrice: values.purchasePrice,
          isInventoryControl: values.isInventoryControl,
          isMultiPrice: values.isMultiPrice,
          categoryId: values.categoryId,
        }
      : {
          ...currentProduct!,
          name: values.name,
          barcode: formatOptionalField(values.barcode),
          internalCode: formatOptionalField(values.internalCode),
          unitSale: "",
          salePrice: values.salePrice,
          purchasePrice: values.purchasePrice,
          isInventoryControl: values.isInventoryControl,
          isMultiPrice: values.isMultiPrice,
          categoryId: values.categoryId,
        };

    const resp = await productInsertOrUpdate(product);

    if (resp.success) {
      if (isNewRecord) {
        currentProduct = resp.data;
        await saveStockInWarehouse(currentProduct!.id, productStocks);
      }
      toast.success(
        `${ProductBusiness.metadata.singularName} ${
          isNewRecord ? "se creó" : "se actualizó"
        } exitósamente.`
      );
    } else {
      toast.error(
        `Error: No se pudo grabar ${ProductBusiness.metadata.singularName}`,
        {
          description: resp.message,
        }
      );
    }

    setIsPending(false);
    return resp;
  };

  const saveStockInWarehouse = async (
    productId: string,
    productStocks: ProductStock[]
  ): Promise<boolean> => {
    const warehouses: Warehouse[] = productStocks.map((stock) => {
      return {
        id: "",
        stock: stock.stock,
        minimumStock: stock.minimunStock,
        branchId: stock.branchId,
        productId: productId,
      };
    });

    const respWarehouse = await warehouseInsertMany(warehouses);

    if (!respWarehouse.success) {
      toast.error(
        `Error: No se pudo grabar stock ${WarehouseBusiness.metadata.singularName}`,
        {
          description: respWarehouse.message,
        }
      );
    } else {
      toast.success(
        `Stock en ${WarehouseBusiness.metadata.singularName} se creó exitósamente.`
      );
    }

    return respWarehouse.success;
  };

  return {
    form,
    handleSave,
    isPending,
    messageGeneralError,
    setMessageGeneralError,
    isNewRecord,
    productStocks,
    setProductStocks,
    isOpenDialogInfo,
    setIsOpenDialogInfo,
  };
};
