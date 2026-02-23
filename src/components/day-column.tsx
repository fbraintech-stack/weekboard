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
      className={`flex min-h-[220px] flex-col rounded-2xl p-3 transition-all duration-300 sm:min-h-[350px] ${
        isToday
          ? "glass glow-accent border-[var(--accent)]/20"
          : "glass"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className={`text-sm font-bold tracking-wide ${
              isToday ? "text-[var(--accent)]" : "text-slate-400"
            }`}
          >
            {DAY_LABELS[day]}
          </h2>
          {isToday && (
            <span className="rounded-full bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[var(--accent)]">
              HOJE
            </span>
          )}
        </div>
        <span
          className={`text-xs font-mono ${
            totalCount > 0 && completedCount === totalCount
              ? "text-emerald-400/70"
              : "text-slate-600"
          }`}
        >
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Progress mini bar */}
      {totalCount > 0 && (
        <div className="mb-3 h-[2px] w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completedCount === totalCount
                ? "bg-emerald-400/50"
                : "bg-[var(--accent)]/40"
            }`}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2">
        {dayTasks.length === 0 ? (
          <p className="mt-8 text-center text-[11px] text-slate-700">
            Sem tarefas
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
