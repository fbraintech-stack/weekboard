"use client";

import { useState } from "react";
import type { DayOfWeek } from "@/types/task";
import { DAY_LABELS } from "@/types/task";
import { DayColumn } from "./day-column";
import { Header } from "./header";
import { CreateTaskForm } from "./create-task-form";
import { useWeekBoardStore } from "@/lib/store";
import { useTasks } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";

const days: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

export function WeekBoard() {
  const { selectedDay, setSelectedDay, filterCategory, setFilterCategory } =
    useWeekBoardStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: categories = [] } = useCategories();

  // Filtrar por categoria se selecionada
  const filteredTasks = filterCategory
    ? tasks.filter((t) => t.category_id === filterCategory)
    : tasks;

  // Calcular progresso geral
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onCreateTask={() => setShowCreateForm(true)} />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        {/* Filtro por categorias */}
        {categories.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Filtrar:</span>
            <button
              onClick={() => setFilterCategory(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterCategory === null
                  ? "bg-slate-700 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
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
                className={`rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity ${
                  filterCategory === cat.id
                    ? "opacity-100"
                    : "opacity-50 hover:opacity-75"
                }`}
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {tasksLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-slate-400">Carregando tarefas...</p>
          </div>
        ) : (
          <>
            {/* Seletor de dia — mobile */}
            <div className="mb-4 flex gap-1 overflow-x-auto sm:hidden">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    selectedDay === day
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600"
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
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Progresso semanal
                </span>
                <span className="text-slate-500">
                  {completedTasks}/{totalTasks} ({progressPercent}%)
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercent === 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal criar tarefa */}
      {showCreateForm && (
        <CreateTaskForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}
