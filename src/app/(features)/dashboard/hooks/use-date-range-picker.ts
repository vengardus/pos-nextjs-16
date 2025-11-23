import { useEffect, useState } from "react";
import { useDateRangeStore } from "@/stores/dashboard/date-range.store";
import { DateRangeTypeEnum } from "../types/date-range-type.enum";
import { DateRangeTypeOption } from "../types/date-range-type.interface";

// Default start date (January 1, 2025)
const DEFAULT_START_DATE = new Date(2025, 0, 1);
// Add a constant for the minimum allowed start date (January 1, 2025)
const MIN_START_DATE = new Date(2025, 0, 1);

export const useDateRangePicker = () => {
  const { setDateRange } = useDateRangeStore();

  // State for selected range type
  const [selectedRangeType, setSelectedRangeType] = useState<DateRangeTypeEnum>(
    DateRangeTypeEnum.ALL
  );
  const [open, setOpen] = useState(false);

  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Get date from n days ago
  const getDaysAgo = (days: number) => {
    const date = getToday();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Get date from n months ago
  const getMonthsAgo = (months: number) => {
    const date = getToday();
    date.setMonth(date.getMonth() - months);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Range type options
  const rangeTypeOptions: DateRangeTypeOption[] = [
    {
      value: DateRangeTypeEnum.ALL,
      label: "All",
      showEndDate: true,
      isStartDateEditable: true,
      isEndDateEditable: true,
      getStartDate: () => DEFAULT_START_DATE,
      getEndDate: getToday,
    },
    {
      value: DateRangeTypeEnum.BY_RANGE,
      label: "By Range",
      showEndDate: true,
      isStartDateEditable: true,
      isEndDateEditable: true,
      getStartDate: () => DEFAULT_START_DATE,
      getEndDate: getToday,
    },
    {
      value: DateRangeTypeEnum.TODAY,
      label: "Today",
      showEndDate: false,
      isStartDateEditable: false,
      isEndDateEditable: false,
      getStartDate: getToday,
      getEndDate: getToday,
    },
    {
      value: DateRangeTypeEnum.BY_DAY,
      label: "By Day",
      showEndDate: false,
      isStartDateEditable: true,
      isEndDateEditable: false,
      getStartDate: getToday,
      getEndDate: function () {
        const date = this.getStartDate();
        date.setHours( 59, 59, 9923,9);
        return date
      },
    },
    {
      value: DateRangeTypeEnum.LAST_7_DAYS,
      label: "Last 7 Days",
      showEndDate: true,
      isStartDateEditable: false,
      isEndDateEditable: false,
      getStartDate: () => getDaysAgo(6),
      getEndDate: getToday,
    },
    {
      value: DateRangeTypeEnum.LAST_30_DAYS,
      label: "Last 30 Days",
      showEndDate: true,
      isStartDateEditable: false,
      isEndDateEditable: false,
      getStartDate: () => getDaysAgo(29),
      getEndDate: getToday,
    },
    {
      value: DateRangeTypeEnum.LAST_12_MONTHS,
      label: "Last 12 Months",
      showEndDate: true,
      isStartDateEditable: false,
      isEndDateEditable: false,
      getStartDate: () => getMonthsAgo(12),
      getEndDate: getToday,
    },
  ];

  // Find the current range type option
  const currentRangeOption =
    rangeTypeOptions.find((option) => option.value === selectedRangeType) ||
    rangeTypeOptions[0];

  // State for start and end dates
  const [startDate, setStartDate] = useState<Date>(
    currentRangeOption.getStartDate()
  );
  const [endDate, setEndDate] = useState<Date>(currentRangeOption.getEndDate());

  // State for popover open status
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Update store when component mounts
  useEffect(() => {
    setDateRange(startDate, endDate);
  }, [startDate, endDate, setDateRange]);

  return {
    setDateRange,
    getToday,
    MIN_START_DATE,
    rangeTypeOptions,
    selectedRangeType,
    setSelectedRangeType,
    open,
    setOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startDateOpen,
    setStartDateOpen,
    endDateOpen,
    setEndDateOpen,
    currentRangeOption,
  };
};
