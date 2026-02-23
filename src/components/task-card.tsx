"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Task, Category, DayOfWeek } from "@/types/task";
import { useToggleTask, useDeleteTask } from "@/hooks/use-tasks";
import { formatScheduledDate } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  day: DayOfWeek;
  category?: Category;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, day, category, onEdit }: TaskCardProps) {
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const isCompleted = task.completed_days?.includes(day) ?? false;
  const isDraggable = task.type !== "scheduled";

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: `${task.id}-${day}`,
    data: { task, fromDay: day },
    disabled: !isDraggable,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...(isDraggable ? listeners : {})}
      className={`group relative border transition-all duration-200 ${
        isDraggable ? "cursor-grab active:cursor-grabbing" : ""
      } rounded-xl ${
        isDragging
          ? "opacity-30 scale-95"
          : isCompleted
            ? "opacity-50"
            : "glass glass-hover"
      }`}
      data-completed={isCompleted || undefined}
    >
      {/* Linha de cor da categoria no topo */}
      {category && (
        <div
          className="absolute top-0 left-3 right-3 h-[2px] rounded-full"
          style={{ backgroundColor: category.color, opacity: 0.5 }}
        />
      )}

      {/* Botões hover — canto superior direito (pointer-events-none quando invisíveis para não interceptar toques) */}
      <div className="absolute -right-1.5 -top-1.5 z-10 flex gap-1 opacity-0 pointer-events-none transition-all group-hover:opacity-100 group-hover:pointer-events-auto">
        {/* Editar */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(task)}
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
        {/* Excluir */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
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

      <div className="p-2 pt-2.5">
        {/* Checkbox + Título */}
        <div className="flex items-start gap-2">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() =>
              toggleTask.mutate({ id: task.id, day, completed: !isCompleted })
            }
            className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all duration-200"
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

          <p
            className={`text-[11px] leading-snug ${isCompleted ? "line-through" : ""}`}
            style={{
              color: isCompleted ? "var(--th-text-muted)" : "var(--th-text)",
            }}
          >
            {task.title}
          </p>
        </div>

        {/* Badges — linha inferior */}
        <div className="mt-1.5 flex items-center gap-1 pl-6">
          {task.type === "oneoff" && (
            <span
              className="rounded px-1 py-px text-[9px]"
              style={{
                background: "var(--th-badge-pontual)",
                color: "var(--th-badge-pontual-text)",
              }}
            >
              pontual
            </span>
          )}
          {task.type === "scheduled" && task.scheduled_date && (
            <span
              className="rounded px-1 py-px text-[9px] font-medium"
              style={{
                background: "var(--th-badge-scheduled)",
                color: "var(--th-badge-scheduled-text)",
              }}
            >
              {formatScheduledDate(task.scheduled_date)}
            </span>
          )}
          {task.carry_over && (
            <span
              className="rounded px-1 py-px text-[9px]"
              style={{
                background: "var(--th-badge-anterior)",
                color: "var(--th-badge-anterior-text)",
              }}
            >
              anterior
            </span>
          )}
          {category && (
            <span
              className="rounded px-1 py-px text-[9px] font-medium"
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

      {/* Estilos inline para estados especiais */}
      <style jsx>{`
        [data-completed="true"] {
          border-color: transparent;
          background: var(--th-surface);
        }
      `}</style>
    </div>
  );
}
