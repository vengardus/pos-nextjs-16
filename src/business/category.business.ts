import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { BaseBusiness } from "./base.business";

export class CategoryBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Categoría",
    pluralName: "Categorías",
  };
}
