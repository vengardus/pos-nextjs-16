import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";

// Interfaces
export interface ResponsiveColumnConfig<T> {
  accessorKey: keyof T;
  screenSize: ScreenSizeEnum;
}

// Factory Function
export const defineResponsiveColumns = <T,>(
  columns: ResponsiveColumnConfig<T>[]
): ResponsiveColumnConfig<T>[] => {
  return columns;
};