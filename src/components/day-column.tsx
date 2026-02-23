"use client";

import { DAY_LABELS } from "@/types/task";
import type { DayOfWeek, Task, Category } from "@/types/task";
import { getCurrentDayOfWeek } from "@/lib/utils";
import { TaskCard } from "./task-card";

interface DayColumnProps {
  day: DayOfWeek;
  tasks: Task[];
  categories: Category[];
}

export function DayColumn({ day, tasks, categories }: DayColumnProps) {
  const isToday = getCurrentDayOfWeek() === day;
  const dayTasks = tasks.filter((t) => t.days.includes(day));
  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalCount = dayTasks.length;

  return (
    <div
      className={`flex min-h-[200px] flex-col rounded-xl border-2 bg-white p-3 transition-colors sm:min-h-[350px] ${
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
        <span className={`text-xs font-medium ${totalCount > 0 && completedCount === totalCount ? "text-green-500" : "text-slate-400"}`}>
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Progress mini bar */}
      {totalCount > 0 && (
        <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2">
        {dayTasks.length === 0 ? (
          <p className="mt-4 text-center text-xs text-slate-300">
            Nenhuma tarefa
          </p>
        ) : (
          dayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              category={categories.find((c) => c.id === task.category_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
