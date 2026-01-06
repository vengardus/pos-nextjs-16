import type { ModelMetadata } from "@/shared/types/common/model-metadata.interface";

export type ModelKey =
  | "brand"
  | "cashRegister"
  | "clientSupplier"
  | "category"
  | "product"
  | "company"
  | "warehouse"
  | "role"
  | "user"
  | "branch"
  | "paymentMethod";

export const MODEL_METADATA: Record<ModelKey, ModelMetadata> = {
  brand: {
    singularName: "Marca",
    pluralName: "Marcas",
  },
  cashRegister: {
    singularName: "Caja",
    pluralName: "Cajas",
  },
  clientSupplier: {
    singularName: "Cliente",
    pluralName: "Clientes",
  },
  category: {
    singularName: "Categoría",
    pluralName: "Categorías",
  },
  product: {
    singularName: "Producto",
    pluralName: "Productos",
  },
  company: {
    singularName: "Compañia",
    pluralName: "Compañias",
  },
  warehouse: {
    singularName: "Almacén",
    pluralName: "Almacenes",
  },
  role: {
    singularName: "Role",
    pluralName: "Roles",
  },
  user: {
    singularName: "Usuario",
    pluralName: "Usuarios",
  },
  branch: {
    singularName: "Sucursal",
    pluralName: "Sucursales",
  },
  paymentMethod: {
    singularName: "Método de pago",
    pluralName: "Métodos de pago",
  },
};

export const getModelMetadata = (key: ModelKey): ModelMetadata =>
  MODEL_METADATA[key];
