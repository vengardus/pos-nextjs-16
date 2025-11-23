import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { BaseBusiness } from "./base.business";

export class BrandBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Marca",
    pluralName: "Marcas",
  };
}