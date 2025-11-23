import { Plus } from "lucide-react";
import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ListHeaderProps {
  modelLabels?: ModelMetadata
  handleAddRecord: () => void;
}
export const ListHeader = ({
  modelLabels,
  handleAddRecord,
}: ListHeaderProps) => {
  return (
    <CardHeader className="flex flex-row md:items-center justify-between  pb-2">
      <CardTitle className="text-2xl font-bold">
        Listado de <span className="capitalize">{` ${modelLabels?.pluralName}`}</span>
      </CardTitle>
      <Button id="btn-add-record" onClick={handleAddRecord}>
        <Plus className="mr-2 h-8 w-h-8 " style={{width: "1.5rem", height: "1.5rem"}} />{" "}
        {/* <span>Agregar</span> */}
        <span className="capitalize text-lg">{` ${modelLabels?.singularName}`}</span>
      </Button>
    </CardHeader>
  );
};
