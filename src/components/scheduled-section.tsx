"use client";

import type { Task, Category } from "@/types/task";
import { useToggleTask, useDeleteTask } from "@/hooks/use-tasks";
import { formatScheduledDate } from "@/lib/utils";

interface ScheduledSectionProps {
  tasks: Task[];
  categories: Category[];
  onEditTask: (task: Task) => void;
}

export function ScheduledSection({ tasks, categories, onEditTask }: ScheduledSectionProps) {
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  if (tasks.length === 0) return null;

  // Ordenar: não-concluídas primeiro (por data crescente), concluídas no final (por data crescente)
  const sorted = [...tasks].sort((a, b) => {
    const aCompleted = (a.completed_days?.length ?? 0) > 0 ? 1 : 0;
    const bCompleted = (b.completed_days?.length ?? 0) > 0 ? 1 : 0;
    if (aCompleted !== bCompleted) return aCompleted - bCompleted;
    // Dentro do mesmo grupo, ordenar por scheduled_date crescente
    const aDate = a.scheduled_date ?? "";
    const bDate = b.scheduled_date ?? "";
    return aDate.localeCompare(bDate);
  });

  // Dia da semana abreviado para a data agendada
  const weekDayLabel = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return labels[date.getDay()];
  };

  return (
    <div className="mt-6 glass rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="text-sm font-bold tracking-wide"
          style={{ color: "var(--th-text-sub)" }}
        >
          Agendadas
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{
            background: "var(--th-badge-scheduled)",
            color: "var(--th-badge-scheduled-text)",
          }}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
        {sorted.map((task) => {
          const isCompleted = (task.completed_days?.length ?? 0) > 0;
          const category = categories.find((c) => c.id === task.category_id);
          // Scheduled tasks use day 1 as toggle day (single completion)
          const toggleDay = task.days[0] ?? 1;

          return (
            <div
              key={task.id}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isCompleted ? "opacity-50" : "glass glass-hover"
              }`}
              style={{
                borderColor: isCompleted ? "transparent" : undefined,
                background: isCompleted ? "var(--th-surface)" : undefined,
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() =>
                  toggleTask.mutate({ id: task.id, day: toggleDay, completed: !isCompleted })
                }
                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all duration-200"
                style={{
                  borderColor: isCompleted
                    ? "var(--th-check-border)"
                    : "var(--th-border-strong)",
                  background: isCompleted ? "var(--th-check-bg)" : "transparent",
                  color: "var(--th-check-icon)",
                }}
                aria-label={
                  isCompleted
                    ? `Desmarcar ${task.title}`
                    : `Marcar ${task.title} como concluída`
                }
              >
                {isCompleted && (
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* Titulo */}
              <span
                className={`flex-1 text-[11px] leading-snug ${isCompleted ? "line-through" : ""}`}
                style={{
                  color: isCompleted ? "var(--th-text-muted)" : "var(--th-text)",
                }}
              >
                {task.title}
              </span>

              {/* Badge de data */}
              {task.scheduled_date && (
                <span
                  className="flex-shrink-0 rounded px-1.5 py-px text-[9px] font-medium"
                  style={{
                    background: "var(--th-badge-scheduled)",
                    color: "var(--th-badge-scheduled-text)",
                  }}
                >
                  {formatScheduledDate(task.scheduled_date)} · {weekDayLabel(task.scheduled_date)}
                </span>
              )}

              {/* Badge de categoria */}
              {category && (
                <span
                  className="flex-shrink-0 rounded px-1 py-px text-[9px] font-medium"
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
              )}

              {/* Botoes hover — editar e excluir */}
              <div className="flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                <button
                  onClick={() => onEditTask(task)}
                  className="flex h-5 w-5 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: "var(--th-btn-close-bg)",
                    border: "1px solid var(--th-border)",
                    color: "var(--th-text-muted)",
                  }}
                  title="Editar"
                  aria-label={`Editar tarefa ${task.title}`}
                >
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  className="flex h-5 w-5 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: "var(--th-btn-close-bg)",
                    border: "1px solid var(--th-border)",
                    color: "var(--th-btn-delete-text)",
                  }}
                  title="Excluir"
                  aria-label={`Excluir tarefa ${task.title}`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
