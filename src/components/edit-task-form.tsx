"use client";

import { useState } from "react";
import { useUpdateTask } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";
import { DAY_LABELS } from "@/types/task";
import type { DayOfWeek, Task, TaskType } from "@/types/task";
import { updateTaskSchema } from "@/lib/schemas";
import { getDayOfWeekFromDate } from "@/lib/utils";

const allDays: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
}

export function EditTaskForm({ task, onClose }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [type, setType] = useState<TaskType>(task.type);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(task.days);
  const [categoryId, setCategoryId] = useState<string | null>(
    task.category_id || null
  );
  const [scheduledDate, setScheduledDate] = useState(
    task.scheduled_date || ""
  );
  const [startTime, setStartTime] = useState(
    task.start_time?.slice(0, 5) || ""
  );
  const [endTime, setEndTime] = useState(
    task.end_time?.slice(0, 5) || ""
  );
  const [error, setError] = useState("");

  const updateTask = useUpdateTask();
  const { data: categories } = useCategories();

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTypeChange = (newType: TaskType) => {
    setType(newType);
    if (newType === "scheduled") {
      setSelectedDays([]);
      setScheduledDate("");
    } else {
      setScheduledDate("");
    }
  };

  const handleDateChange = (dateStr: string) => {
    setScheduledDate(dateStr);
    if (dateStr) {
      const day = getDayOfWeekFromDate(dateStr);
      setSelectedDays([day]);
    } else {
      setSelectedDays([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (type === "scheduled" && !scheduledDate) {
      setError("Selecione uma data para a tarefa agendada");
      return;
    }

    const result = updateTaskSchema.safeParse({
      title,
      type,
      days: selectedDays,
      category_id: categoryId,
      scheduled_date: type === "scheduled" ? scheduledDate : null,
      start_time: startTime || null,
      end_time: endTime || null,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    updateTask.mutate(
      { id: task.id, ...result.data },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "var(--th-overlay)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "var(--th-surface-raised)",
          border: "1px solid var(--th-border)",
          boxShadow: "var(--th-shadow-elevated)",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--th-text)" }}
          >
            Editar Tarefa
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors"
            style={{ color: "var(--th-text-faint)" }}
            aria-label="Fechar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="O que precisa fazer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
            style={{
              background: "var(--th-input-bg)",
              border: "1px solid var(--th-border-input)",
              color: "var(--th-text)",
            }}
          />

          {/* Tipo */}
          <div>
            <label
              className="mb-2 block text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "var(--th-text-faint)" }}
            >
              Tipo
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("recurrent")}
                className="flex-1 rounded-[10px] border px-3 py-2.5 text-xs font-medium transition-all"
                style={{
                  borderColor:
                    type === "recurrent"
                      ? "rgba(from var(--th-accent) r g b / 0.3)"
                      : "var(--th-border)",
                  background:
                    type === "recurrent"
                      ? "var(--th-accent-muted)"
                      : "var(--th-surface)",
                  color:
                    type === "recurrent"
                      ? "var(--th-accent)"
                      : "var(--th-text-faint)",
                }}
              >
                Recorrente
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("oneoff")}
                className="flex-1 rounded-[10px] border px-3 py-2.5 text-xs font-medium transition-all"
                style={{
                  borderColor:
                    type === "oneoff"
                      ? "var(--th-badge-pontual-text)"
                      : "var(--th-border)",
                  background:
                    type === "oneoff"
                      ? "var(--th-badge-pontual)"
                      : "var(--th-surface)",
                  color:
                    type === "oneoff"
                      ? "var(--th-badge-pontual-text)"
                      : "var(--th-text-faint)",
                }}
              >
                Pontual
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("scheduled")}
                className="flex-1 rounded-[10px] border px-3 py-2.5 text-xs font-medium transition-all"
                style={{
                  borderColor:
                    type === "scheduled"
                      ? "var(--th-badge-scheduled-text)"
                      : "var(--th-border)",
                  background:
                    type === "scheduled"
                      ? "var(--th-badge-scheduled)"
                      : "var(--th-surface)",
                  color:
                    type === "scheduled"
                      ? "var(--th-badge-scheduled-text)"
                      : "var(--th-text-faint)",
                }}
              >
                Agendada
              </button>
            </div>
          </div>

          {/* Data (para tipo agendada) */}
          {type === "scheduled" && (
            <div>
              <label
                className="mb-2 block text-[11px] font-medium uppercase tracking-widest"
                style={{ color: "var(--th-text-faint)" }}
              >
                Data
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  background: "var(--th-input-bg)",
                  border: "1px solid var(--th-border-input)",
                  color: "var(--th-text)",
                  colorScheme: "inherit",
                }}
              />
              {scheduledDate && (
                <p
                  className="mt-1.5 text-[11px]"
                  style={{ color: "var(--th-text-muted)" }}
                >
                  Aparecerá na coluna de{" "}
                  {DAY_LABELS[getDayOfWeekFromDate(scheduledDate)]}
                </p>
              )}
            </div>
          )}

          {/* Dias (apenas para recorrente e pontual) */}
          {type !== "scheduled" && (
            <div>
              <label
                className="mb-2 block text-[11px] font-medium uppercase tracking-widest"
                style={{ color: "var(--th-text-faint)" }}
              >
                Dias
              </label>
              <div className="flex gap-1.5">
                {allDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className="flex-1 rounded-[10px] py-2.5 text-xs font-semibold transition-all"
                    style={{
                      background: selectedDays.includes(day)
                        ? "var(--th-accent)"
                        : "var(--th-surface)",
                      color: selectedDays.includes(day)
                        ? "#ffffff"
                        : "var(--th-text-muted)",
                    }}
                  >
                    {DAY_LABELS[day]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Horário (opcional) */}
          <div>
            <label
              className="mb-2 block text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "var(--th-text-faint)" }}
            >
              Horário (opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex-1 rounded-[10px] px-3 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: "var(--th-input-bg)",
                  border: "1px solid var(--th-border-input)",
                  color: "var(--th-text)",
                  colorScheme: "inherit",
                }}
                placeholder="Início"
              />
              <span className="flex items-center text-xs" style={{ color: "var(--th-text-muted)" }}>—</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex-1 rounded-[10px] px-3 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: "var(--th-input-bg)",
                  border: "1px solid var(--th-border-input)",
                  color: "var(--th-text)",
                  colorScheme: "inherit",
                }}
                placeholder="Fim"
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label
              className="mb-2 block text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "var(--th-text-faint)" }}
            >
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background:
                    categoryId === null
                      ? "var(--th-surface-raised)"
                      : "var(--th-surface)",
                  color:
                    categoryId === null
                      ? "var(--th-text)"
                      : "var(--th-text-muted)",
                  border: `1px solid ${categoryId === null ? "var(--th-border-strong)" : "var(--th-border)"}`,
                }}
              >
                Nenhuma
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor:
                      categoryId === cat.id
                        ? `${cat.color}30`
                        : "var(--th-surface)",
                    color:
                      categoryId === cat.id
                        ? cat.color
                        : "var(--th-text-faint)",
                    border: `1px solid ${categoryId === cat.id ? `${cat.color}40` : "var(--th-border)"}`,
                  }}
                >
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color, opacity: 0.7 }}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p
              className="rounded-[10px] px-3 py-2 text-xs"
              style={{
                background: "var(--th-error-bg)",
                border: "1px solid var(--th-error-border)",
                color: "var(--th-error-text)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={updateTask.isPending}
            className="mt-1 rounded-[10px] py-3 text-sm font-semibold transition-all hover:brightness-105 disabled:opacity-50"
            style={{ background: "var(--th-accent)", color: "#ffffff" }}
          >
            {updateTask.isPending ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}
