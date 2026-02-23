import { create } from "zustand";
import type { DayOfWeek } from "@/types/task";
import { getCurrentDayOfWeek } from "@/lib/utils";

interface WeekBoardState {
  selectedDay: DayOfWeek;
  filterCategory: string | null;
  setSelectedDay: (day: DayOfWeek) => void;
  setFilterCategory: (categoryId: string | null) => void;
}

export const useWeekBoardStore = create<WeekBoardState>((set) => ({
  selectedDay: getCurrentDayOfWeek() as DayOfWeek,
  filterCategory: null,
  setSelectedDay: (day) => set({ selectedDay: day }),
  setFilterCategory: (categoryId) => set({ filterCategory: categoryId }),
}));
