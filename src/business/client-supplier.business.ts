import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { BaseBusiness } from "./base.business";

export class ClientSupplierBusiness extends BaseBusiness {
  static metadata: ModelMetadata = {
    singularName: "Cliente",
    pluralName: "Clientes",
  };
}
