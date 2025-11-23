import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { BaseBusiness } from "./base.business";

export class CompanyBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Compañia",
    pluralName: "Compañias",
  };
}
