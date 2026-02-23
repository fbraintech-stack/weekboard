"use client";

import type { Task, Category } from "@/types/task";
import { useToggleTask, useDeleteTask } from "@/hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  category?: Category;
}

export function TaskCard({ task, category }: TaskCardProps) {
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        task.completed
          ? "border-transparent bg-white/[0.02] opacity-50"
          : "glass glass-hover"
      }`}
    >
      {/* Faixa de cor da categoria */}
      {category && (
        <div
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
          style={{ backgroundColor: category.color, opacity: 0.7 }}
        />
      )}

      <div className="flex items-start gap-2.5 p-2.5 pl-3.5">
        {/* Checkbox */}
        <button
          onClick={() =>
            toggleTask.mutate({ id: task.id, completed: !task.completed })
          }
          className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
            task.completed
              ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-300"
              : "border-white/20 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-muted)]"
          }`}
        >
          {task.completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs leading-snug ${
              task.completed
                ? "text-slate-600 line-through"
                : "text-slate-200"
            }`}
          >
            {task.title}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            {task.type === "oneoff" && (
              <span className="rounded-md bg-amber-400/10 px-1.5 py-0.5 text-[10px] text-amber-300/70">
                pontual
              </span>
            )}
            {task.carry_over && (
              <span className="rounded-md bg-orange-400/10 px-1.5 py-0.5 text-[10px] text-orange-300/70">
                anterior
              </span>
            )}
            {category && (
              <span
                className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${category.color}15`,
                  color: category.color,
                }}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>

        {/* Botão excluir */}
        <button
          onClick={() => deleteTask.mutate(task.id)}
          className="flex-shrink-0 rounded-lg p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 text-slate-600 hover:text-red-400"
          title="Excluir"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
