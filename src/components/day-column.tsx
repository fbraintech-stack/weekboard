"use client";

import { useDroppable } from "@dnd-kit/core";
import { DAY_LABELS } from "@/types/task";
import type { DayOfWeek, Task, Category } from "@/types/task";
import { getCurrentDayOfWeek } from "@/lib/utils";
import { TaskCard } from "./task-card";

interface DayColumnProps {
  day: DayOfWeek;
  tasks: Task[];
  categories: Category[];
  onEditTask: (task: Task) => void;
}

export function DayColumn({ day, tasks, categories, onEditTask }: DayColumnProps) {
  const isToday = getCurrentDayOfWeek() === day;
  const dayTasks = tasks.filter((t) => t.days.includes(day));

  // Ordenar: não-concluídas primeiro, concluídas no final
  const sortedTasks = [...dayTasks].sort((a, b) => {
    const aCompleted = a.completed_days?.includes(day) ? 1 : 0;
    const bCompleted = b.completed_days?.includes(day) ? 1 : 0;
    return aCompleted - bCompleted;
  });

  const completedCount = dayTasks.filter((t) =>
    t.completed_days?.includes(day)
  ).length;
  const totalCount = dayTasks.length;

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day}`,
    data: { day },
  });

  return (
    <div
      ref={setNodeRef}
      role="region"
      aria-label={`${DAY_LABELS[day]} — ${completedCount} de ${totalCount} concluídas`}
      className={`flex min-h-[220px] flex-col rounded-xl p-3 transition-all duration-300 sm:min-h-[350px] ${
        isOver
          ? "glass ring-2 ring-[var(--th-accent)] shadow-lg"
          : isToday
            ? "glass glow-accent"
            : "glass"
      }`}
      style={{
        borderColor: isOver
          ? "var(--th-accent)"
          : isToday
            ? "rgba(from var(--th-accent) r g b / 0.2)"
            : undefined,
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="text-sm font-bold tracking-wide"
            style={{ color: isToday ? "var(--th-accent)" : "var(--th-text-sub)" }}
          >
            {DAY_LABELS[day]}
          </h2>
          {isToday && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider"
              style={{
                background: "var(--th-accent-muted)",
                color: "var(--th-accent)",
              }}
            >
              HOJE
            </span>
          )}
        </div>
        <span
          className="text-xs font-mono"
          style={{
            color:
              totalCount > 0 && completedCount === totalCount
                ? "var(--th-check-icon)"
                : "var(--th-text-muted)",
          }}
        >
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Progress mini bar */}
      {totalCount > 0 && (
        <div
          className="mb-3 h-[2px] w-full overflow-hidden rounded-full"
          style={{ background: "var(--th-surface-raised)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(completedCount / totalCount) * 100}%`,
              background:
                completedCount === totalCount
                  ? "var(--th-check-progress)"
                  : "var(--th-accent)",
              opacity: completedCount === totalCount ? 1 : 0.4,
            }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 max-h-[500px] sm:max-h-[420px] overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <p
            className="mt-8 text-center text-[11px]"
            style={{ color: isOver ? "var(--th-accent)" : "var(--th-text-ghost)" }}
          >
            {isOver ? "Solte aqui" : "Sem tarefas"}
          </p>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={`${task.id}-${day}`}
              task={task}
              day={day}
              category={categories.find((c) => c.id === task.category_id)}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
