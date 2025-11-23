import { DateRangeTypeEnum } from "./date-range-type.enum";


// Interface for range type options
export interface DateRangeTypeOption {
  value: DateRangeTypeEnum;
  label: string;
  showEndDate: boolean;
  isStartDateEditable: boolean;
  isEndDateEditable: boolean;
  getStartDate: () => Date;
  getEndDate: () => Date;
}
