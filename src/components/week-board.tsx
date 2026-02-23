"use client";

import { useState } from "react";
import type { DayOfWeek } from "@/types/task";
import { DAY_LABELS } from "@/types/task";
import { DayColumn } from "./day-column";
import { Header } from "./header";
import { CreateTaskForm } from "./create-task-form";
import { ResetNotification } from "./reset-notification";
import { useWeekBoardStore } from "@/lib/store";
import { useTasks } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";
import { useWeeklyReset } from "@/hooks/use-weekly-reset";

const days: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

export function WeekBoard() {
  const { selectedDay, setSelectedDay, filterCategory, setFilterCategory } =
    useWeekBoardStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: categories = [] } = useCategories();
  const { resetResult, isResetting, dismissNotification } = useWeeklyReset();

  const filteredTasks = filterCategory
    ? tasks.filter((t) => t.category_id === filterCategory)
    : tasks;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen">
      <Header onCreateTask={() => setShowCreateForm(true)} />

      {/* Notificação de reset semanal */}
      {resetResult && (
        <div className="pt-4">
          <ResetNotification
            recurrentReset={resetResult.recurrentReset}
            carryOver={resetResult.carryOver}
            removed={resetResult.removed}
            onDismiss={dismissNotification}
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
        {/* Filtro por categorias */}
        {categories.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-widest text-slate-600">
              Filtrar
            </span>
            <button
              onClick={() => setFilterCategory(null)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                filterCategory === null
                  ? "bg-white/10 text-white"
                  : "glass text-slate-500 hover:text-slate-300"
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setFilterCategory(
                    filterCategory === cat.id ? null : cat.id
                  )
                }
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  filterCategory === cat.id
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={{
                  backgroundColor:
                    filterCategory === cat.id
                      ? `${cat.color}30`
                      : "rgba(255,255,255,0.03)",
                  borderColor:
                    filterCategory === cat.id
                      ? `${cat.color}40`
                      : "rgba(255,255,255,0.06)",
                  borderWidth: 1,
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
        )}

        {tasksLoading || isResetting ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
              <p className="text-xs text-slate-600">
                {isResetting
                  ? "Preparando nova semana..."
                  : "Carregando tarefas..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Seletor de dia — mobile */}
            <div className="mb-4 flex gap-1.5 overflow-x-auto sm:hidden">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    selectedDay === day
                      ? "bg-[var(--accent)] text-white"
                      : "glass text-slate-500"
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>

            {/* Grid desktop: 7 colunas */}
            <div className="hidden gap-3 sm:grid sm:grid-cols-7">
              {days.map((day) => (
                <DayColumn
                  key={day}
                  day={day}
                  tasks={filteredTasks}
                  categories={categories}
                />
              ))}
            </div>

            {/* Mobile: 1 dia por vez */}
            <div className="sm:hidden">
              <DayColumn
                day={selectedDay}
                tasks={filteredTasks}
                categories={categories}
              />
            </div>

            {/* Barra de progresso semanal */}
            <div className="mt-6 glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Progresso semanal
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {completedTasks}/{totalTasks}{" "}
                  <span className="text-[var(--accent)]">
                    {progressPercent}%
                  </span>
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    progressPercent === 100
                      ? "bg-emerald-400/60"
                      : "bg-gradient-to-r from-[var(--accent)]/40 to-[var(--accent)]/70"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {showCreateForm && (
        <CreateTaskForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}
