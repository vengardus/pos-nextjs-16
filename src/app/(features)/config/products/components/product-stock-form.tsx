import { useState, type JSX } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { DeleteIcon } from "lucide-react";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import type { ProductStock } from "@/types/interfaces/product/product-stock.interface";
import { ComboboxForm } from "@/components/common/form/combobox-form";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { Button } from "@/components/ui/button";

const defaultValues: ProductStock = {
  productId: "",
  branchId: "",
  branchLabel: "",
  stock: 0,
  minimunStock: 0,
};
interface ProductStockFormProps<T extends FieldValues> {
  control: Control<T>;
  branches: Branch[];
  handleSelect: (value: string) => void;
  handlePostSave: () => void;
  productStocks: ProductStock[];
  setProductStocks: (value: ProductStock[]) => void;
  isNewRecord: boolean;
}
export const ProductStockForm = <T extends FieldValues>({
  control,
  branches,
  handleSelect,
  handlePostSave,
  productStocks,
  setProductStocks,
  isNewRecord,
}: ProductStockFormProps<T>): JSX.Element => {
  const [branchId, setBranchId] = useState(defaultValues.branchId);
  const [branchLabel, setBranchLabel] = useState(defaultValues.branchLabel);
  const [stockValue, setStockValue] = useState(defaultValues.stock.toString());
  const [minimunStockValue, setMinimunStockValue] = useState(
    defaultValues.minimunStock.toString()
  );
  const [message, setMessage] = useState("");

  const initData = () => {
    setBranchId(defaultValues.branchId);
    setBranchLabel(defaultValues.branchLabel);
    setStockValue(defaultValues.stock.toString());
    setMinimunStockValue(defaultValues.minimunStock.toString());

    setMessage("");
  };
  const handleAddProductStock = () => {
    if (!branchId) {
      setMessage("Seleccione una Sucursal");
      return;
    }
    const newProductStock: ProductStock = {
      productId: "",
      branchId: branchId,
      branchLabel: branchLabel,
      stock: stockValue ? parseInt(stockValue) : 0,
      minimunStock: minimunStockValue ? parseInt(minimunStockValue) : 0,
    };
    const existingIndex = productStocks.findIndex(
      (item) => item.branchId === newProductStock.branchId
    );

    if (existingIndex !== -1) {
      // Si ya existe, actualizar los datos
      const updatedProductStocks = [...productStocks];
      updatedProductStocks[existingIndex] = newProductStock;
      setProductStocks(updatedProductStocks);
    } else {
      setProductStocks([...productStocks, newProductStock]);
    }

    initData();
    handlePostSave();
  };

  return (
    <div className="border borde-2 p-2 border-white w-full">
      <h2 className="text-md font-bold underline underline-offset-2 text-center">
        Stock por Sucursales
      </h2>
      <section hidden={!isNewRecord}>
        <ComboboxForm
          control={control}
          name={"branchId" as Path<T>}
          data={branches.map((b) => ({ label: b.name, value: b.id }))}
          label="Sucursal"
          flexDirection="row"
          handleSelect={(value: string, label?: string) => {
            setBranchId(value);
            setBranchLabel(label ?? "");
            setMessage("");
            const item = productStocks.find((p) => p.branchId === value);
            if (item) {
              setStockValue(item.stock.toString());
              setMinimunStockValue(item.minimunStock.toString());
            }
            handleSelect(value);
          }}
        />

        <InputFieldForm
          control={control}
          name={"stock" as Path<T>}
          type="number"
          label="Stock"
          flexDirection="row"
          value={stockValue}
          onChange={(e) => setStockValue(e.target.value)}
        />

        <InputFieldForm
          control={control}
          name={"minimunStock" as Path<T>}
          type="number"
          label="Stock Minimo"
          flexDirection="row"
          value={minimunStockValue}
          onChange={(e) => setMinimunStockValue(e.target.value)}
        />

        <div className="text-red-500">{message}</div>
        <Button type="button" onClick={handleAddProductStock}>
          Agregar
        </Button>
      </section>

      <section className="mt-2">
        {productStocks.map((item) => (
          <div key={item.branchId} className="flex justify-between">
            <p>{item.branchLabel}</p>
            <p>{item.stock}</p>
            <p>{item.minimunStock}</p>
            {isNewRecord && (
              <DeleteIcon
                onClick={() => {
                  const updatedProductStocks = productStocks.filter(
                    (p) => p.branchId !== item.branchId
                  );
                  setProductStocks(updatedProductStocks);
                }}
              />
            )}
          </div>
        ))}
      </section>

      <section hidden={isNewRecord} className="mt-2 text-yellow-300">
        <p>Importante:</p>
        Para modificar el stock de una sucursal, debe hacerlo en el módulo de Sucursales
      </section>
    </div>
  );
};
