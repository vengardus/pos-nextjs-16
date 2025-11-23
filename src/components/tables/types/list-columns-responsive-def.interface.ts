import { ScreenSizeEnum } from "@/utils/browser/get-screen-size";

export interface ListColumnsResponsiveDef<TData,> {
    accessorKey: keyof TData,
    screenSize: ScreenSizeEnum
  }
  