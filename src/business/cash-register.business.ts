import  { BaseBusiness } from "./base.business";
import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";

export class CashRegisterBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Caja",
    pluralName: "Cajas",
  };
}
