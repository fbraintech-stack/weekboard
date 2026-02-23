"use client";

import { DAY_LABELS } from "@/types/task";
import type { DayOfWeek } from "@/types/task";
import { getCurrentDayOfWeek } from "@/lib/utils";

interface DayColumnProps {
  day: DayOfWeek;
}

export function DayColumn({ day }: DayColumnProps) {
  const isToday = getCurrentDayOfWeek() === day;

  return (
    <div
      className={`flex min-h-[200px] flex-col rounded-xl border-2 bg-white p-3 transition-colors sm:min-h-[300px] ${
        isToday
          ? "border-blue-400 shadow-sm shadow-blue-100"
          : "border-slate-200"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className={`text-sm font-bold ${
              isToday ? "text-blue-600" : "text-slate-700"
            }`}
          >
            {DAY_LABELS[day]}
          </h2>
          {isToday && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
              HOJE
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">0/0</span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <p className="text-center text-xs text-slate-300">
          Nenhuma tarefa ainda
        </p>
      </div>
    </div>
  );
}
