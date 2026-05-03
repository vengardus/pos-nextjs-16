import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import type { ModelMetadata } from "@/shared/types/common/model-metadata.interface";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ListHeaderProps {
  modelLabels?: ModelMetadata;
  handleAddRecord: () => void;
  isAddDisabled?: boolean;
  headerActions?: ReactNode;
  showAddButton?: boolean;
  stackActionsOnMobile?: boolean;
}
export const ListHeader = ({
  modelLabels,
  handleAddRecord,
  isAddDisabled = false,
  headerActions,
  showAddButton = true,
  stackActionsOnMobile = false,
}: ListHeaderProps) => {
  return (
    <CardHeader
      className={`flex justify-between pb-2 ${
        stackActionsOnMobile
          ? "flex-col items-start gap-3 md:flex-row md:items-center"
          : "flex-row md:items-center"
      }`}
    >
      <CardTitle className="text-2xl font-bold">
        Listado de <span className="capitalize">{` ${modelLabels?.pluralName}`}</span>
      </CardTitle>
      <div
        className={
          stackActionsOnMobile
            ? "flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center"
            : "flex items-center gap-3"
        }
      >
        {headerActions}
        {showAddButton && (
          <Button
            id="btn-add-record"
            onClick={handleAddRecord}
            disabled={isAddDisabled}
          >
            <Plus
              className="mr-2 h-8 w-h-8 "
              style={{ width: "1.5rem", height: "1.5rem" }}
            />{" "}
            {/* <span>Agregar</span> */}
            <span className="capitalize text-lg">{` ${modelLabels?.singularName}`}</span>
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
