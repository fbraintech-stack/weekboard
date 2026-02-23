import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DayOfWeek } from "@/types/task";
import { getCurrentDayOfWeek } from "@/lib/utils";

export type Theme = "dark" | "apple";

interface WeekBoardState {
  theme: Theme;
  selectedDay: DayOfWeek;
  filterCategory: string | null;
  toggleTheme: () => void;
  setSelectedDay: (day: DayOfWeek) => void;
  setFilterCategory: (categoryId: string | null) => void;
}

export const useWeekBoardStore = create<WeekBoardState>()(
  persist(
    (set) => ({
      theme: "dark",
      selectedDay: getCurrentDayOfWeek() as DayOfWeek,
      filterCategory: null,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "apple" : "dark",
        })),
      setSelectedDay: (day) => set({ selectedDay: day }),
      setFilterCategory: (categoryId) => set({ filterCategory: categoryId }),
    }),
    {
      name: "weekboard-settings",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
