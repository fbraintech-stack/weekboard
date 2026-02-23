"use client";

import type { DayOfWeek } from "@/types/task";
import { DAY_LABELS } from "@/types/task";
import { DayColumn } from "./day-column";
import { useWeekBoardStore } from "@/lib/store";

const days: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

export function WeekBoard() {
  const { selectedDay, setSelectedDay } = useWeekBoardStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      {/* Seletor de dia — visível só no mobile */}
      <div className="mb-4 flex gap-1 overflow-x-auto sm:hidden">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              selectedDay === day
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            {DAY_LABELS[day]}
          </button>
        ))}
      </div>

      {/* Grid desktop: 7 colunas */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-7">
        {days.map((day) => (
          <DayColumn key={day} day={day} />
        ))}
      </div>

      {/* Mobile: 1 dia por vez */}
      <div className="sm:hidden">
        <DayColumn day={selectedDay} />
      </div>

      {/* Barra de progresso */}
      <div className="mt-6 rounded-lg bg-white p-4 border border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Progresso semanal</span>
          <span className="text-slate-500">0%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
