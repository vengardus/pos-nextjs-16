import  { BaseBusiness } from "./base.business";
import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";

export class BranchBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Sucursal",
    pluralName: "Sucursales",
  };
}
 