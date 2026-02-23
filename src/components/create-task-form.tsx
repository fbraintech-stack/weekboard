"use client";

import { useState } from "react";
import { useCreateTask } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";
import { DAY_LABELS } from "@/types/task";
import type { DayOfWeek, TaskType } from "@/types/task";
import { createTaskSchema } from "@/lib/schemas";

const allDays: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

interface CreateTaskFormProps {
  onClose: () => void;
}

export function CreateTaskForm({ onClose }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("recurrent");
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const createTask = useCreateTask();
  const { data: categories } = useCategories();

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = createTaskSchema.safeParse({
      title,
      type,
      days: selectedDays,
      category_id: categoryId,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    createTask.mutate(result.data, {
      onSuccess: () => {
        setTitle("");
        setSelectedDays([]);
        onClose();
      },
      onError: (err) => setError(err.message),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Título */}
          <input
            type="text"
            placeholder="O que precisa fazer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {/* Tipo */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Tipo
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("recurrent")}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  type === "recurrent"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                &#128260; Recorrente
              </button>
              <button
                type="button"
                onClick={() => setType("oneoff")}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  type === "oneoff"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                &#9889; Pontual
              </button>
            </div>
          </div>

          {/* Dias */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Dias da semana
            </label>
            <div className="flex gap-1">
              {allDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                    selectedDays.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  categoryId === null
                    ? "bg-slate-700 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Nenhuma
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity ${
                    categoryId === cat.id ? "opacity-100" : "opacity-50 hover:opacity-75"
                  }`}
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={createTask.isPending}
            className="rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {createTask.isPending ? "Criando..." : "Criar Tarefa"}
          </button>
        </form>
      </div>
    </div>
  );
}
