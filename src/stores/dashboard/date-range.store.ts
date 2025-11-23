import { create } from "zustand";

interface DateRangeState {
  startDate: Date;
  endDate: Date;
  setDateRange: (startDate: Date, endDate: Date) => void;
}

export const useDateRangeStore = create<DateRangeState>((set) => ({
  startDate: new Date(2025, 0, 1), // January 1, 2025
  endDate: new Date(), // Current date
  setDateRange: (startDate: Date, endDate: Date) => {
    const newStartDate = new Date(startDate);
    newStartDate.setHours(0, 0, 0, 0);

    const newEndDate = new Date(endDate);
    newEndDate.setHours(23, 59, 59, 999);

    console.log("setDateRange::", newStartDate, newEndDate);
    set({ startDate: newStartDate, endDate: newEndDate });
  },
}));
