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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md glass rounded-3xl p-6 shadow-2xl border-white/[0.08]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
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
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-[var(--accent)]/40 focus:bg-white/[0.07]"
          />

          {/* Tipo */}
          <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-widest text-slate-500">
              Tipo
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("recurrent")}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                  type === "recurrent"
                    ? "border-[var(--accent)]/30 bg-[var(--accent-muted)] text-[var(--accent)]"
                    : "border-white/8 bg-white/3 text-slate-500 hover:bg-white/5"
                }`}
              >
                Recorrente
              </button>
              <button
                type="button"
                onClick={() => setType("oneoff")}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                  type === "oneoff"
                    ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                    : "border-white/8 bg-white/3 text-slate-500 hover:bg-white/5"
                }`}
              >
                Pontual
              </button>
            </div>
          </div>

          {/* Dias */}
          <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-widest text-slate-500">
              Dias
            </label>
            <div className="flex gap-1.5">
              {allDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    selectedDays.includes(day)
                      ? "bg-[var(--accent)] text-white"
                      : "bg-white/5 text-slate-600 hover:bg-white/8 hover:text-slate-400"
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-widest text-slate-500">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  categoryId === null
                    ? "bg-white/10 text-white"
                    : "bg-white/3 text-slate-600 hover:text-slate-400"
                }`}
              >
                Nenhuma
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    categoryId === cat.id
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  style={{
                    backgroundColor:
                      categoryId === cat.id
                        ? `${cat.color}30`
                        : "rgba(255,255,255,0.03)",
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
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={createTask.isPending}
            className="mt-1 rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {createTask.isPending ? "Criando..." : "Criar Tarefa"}
          </button>
        </form>
      </div>
    </div>
  );
}
