import { Input } from "@/components/ui/input";
import { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";

interface ListFilterProps {
  modelLabels: ModelMetadata;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}
export const ListFilter = ({
  modelLabels,
  globalFilter,
  setGlobalFilter,
}: ListFilterProps) => {
  return (
    <div className="flex items-center py-4 w-[70%]">
      <Input
        placeholder={`Buscar ${modelLabels.pluralName}`}
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
