import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { BaseBusiness } from "./base.business";

export class WarehouseBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Almacén",
    pluralName: "Almacenes",
  };
}