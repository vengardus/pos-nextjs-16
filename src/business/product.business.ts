import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { BaseBusiness } from "./base.business";

export class ProductBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Producto",
    pluralName: "Productos",
  };
} 