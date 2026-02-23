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
      className={`group relative rounded-lg border p-2.5 transition-all ${
        task.completed
          ? "border-slate-100 bg-slate-50 opacity-60"
          : "border-slate-200 bg-white hover:shadow-sm"
      }`}
    >
      {/* Faixa de cor da categoria */}
      {category && (
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
          style={{ backgroundColor: category.color }}
        />
      )}

      <div className="flex items-start gap-2 pl-2">
        {/* Checkbox */}
        <button
          onClick={() =>
            toggleTask.mutate({ id: task.id, completed: !task.completed })
          }
          className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
            task.completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-slate-300 hover:border-blue-400"
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
                ? "text-slate-400 line-through"
                : "text-slate-700"
            }`}
          >
            {task.title}
          </p>
          <div className="mt-1 flex items-center gap-1">
            {task.type === "oneoff" && (
              <span className="text-[10px] text-amber-500" title="Pontual">
                &#9889;
              </span>
            )}
            {task.carry_over && (
              <span className="text-[10px] text-orange-500" title="Da semana passada">
                &#8594;
              </span>
            )}
            {category && (
              <span
                className="rounded px-1 py-0.5 text-[10px] font-medium text-white"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>

        {/* Botão excluir */}
        <button
          onClick={() => deleteTask.mutate(task.id)}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
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
