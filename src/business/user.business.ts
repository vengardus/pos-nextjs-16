import type { ModelMetadata } from "@/types/interfaces/common/model-metadata.interface";
import { BaseBusiness } from "./base.business";

export class UserBusiness extends BaseBusiness {
    static metadata: ModelMetadata = {
      singularName: "Usuario",
      pluralName: "Usuarios",
    };
  }
  