"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { DayOfWeek, Task } from "@/types/task";
import { DAY_LABELS } from "@/types/task";
import { DayColumn } from "./day-column";
import { Header } from "./header";
import { CreateTaskForm } from "./create-task-form";
import { EditTaskForm } from "./edit-task-form";
import { ResetNotification } from "./reset-notification";
import { ScheduledSection } from "./scheduled-section";
import { useWeekBoardStore } from "@/lib/store";
import { useTasks, useUpdateTaskDays } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";
import { useWeeklyReset } from "@/hooks/use-weekly-reset";

const days: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

export function WeekBoard() {
  const { selectedDay, setSelectedDay, filterCategory, setFilterCategory } =
    useWeekBoardStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: categories = [] } = useCategories();
  const { resetResult, isResetting, dismissNotification } = useWeeklyReset();
  const updateTaskDays = useUpdateTaskDays();

  // Separar tarefas agendadas das tarefas da semana
  const scheduledTasks = tasks.filter((t) => t.type === "scheduled");
  const weekTasks = tasks.filter((t) => t.type !== "scheduled");

  const filteredWeekTasks = filterCategory
    ? weekTasks.filter((t) => t.category_id === filterCategory)
    : weekTasks;

  const filteredScheduledTasks = filterCategory
    ? scheduledTasks.filter((t) => t.category_id === filterCategory)
    : scheduledTasks;

  // Progresso: conta completions por dia (só tarefas da semana, sem agendadas)
  let totalItems = 0;
  let completedItems = 0;
  for (const task of weekTasks) {
    totalItems += task.days.length;
    for (const day of task.days) {
      if (task.completed_days?.includes(day)) {
        completedItems++;
      }
    }
  }
  const progressPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const { task } = event.active.data.current as { task: Task; fromDay: DayOfWeek };
    setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const { task, fromDay } = active.data.current as {
      task: Task;
      fromDay: DayOfWeek;
    };

    // FR-002: drag & drop apenas para tarefas pontuais
    if (task.type !== "oneoff") return;

    let toDay: DayOfWeek | null = null;

    if (over.id.toString().startsWith("day-")) {
      toDay = Number(over.id.toString().replace("day-", "")) as DayOfWeek;
    } else {
      const overData = over.data.current as { task?: Task; fromDay?: DayOfWeek } | undefined;
      if (overData?.fromDay) {
        toDay = overData.fromDay;
      }
    }

    if (!toDay || toDay === fromDay) return;

    const newDays = task.days
      .filter((d) => d !== fromDay)
      .concat(task.days.includes(toDay) ? [] : [toDay])
      .sort((a, b) => a - b) as DayOfWeek[];

    if (newDays.length === 0) return;

    updateTaskDays.mutate({ id: task.id, days: newDays });
  }

  return (
    <div className="min-h-screen">
      <Header onCreateTask={() => setShowCreateForm(true)} />

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
            <span
              className="text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "var(--th-text-muted)" }}
            >
              Filtrar
            </span>
            <button
              onClick={() => setFilterCategory(null)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filterCategory === null ? "" : "glass"
              }`}
              style={{
                background: filterCategory === null ? "var(--th-surface-raised)" : undefined,
                color: filterCategory === null ? "var(--th-text)" : "var(--th-text-faint)",
              }}
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
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  backgroundColor:
                    filterCategory === cat.id
                      ? `${cat.color}30`
                      : "var(--th-surface)",
                  borderColor:
                    filterCategory === cat.id
                      ? `${cat.color}40`
                      : "var(--th-border)",
                  borderWidth: 1,
                  color:
                    filterCategory === cat.id
                      ? cat.color
                      : "var(--th-text-faint)",
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
              <div
                className="h-5 w-5 animate-spin rounded-full border-2"
                style={{
                  borderColor: "var(--th-accent-muted)",
                  borderTopColor: "var(--th-accent)",
                }}
              />
              <p className="text-xs" style={{ color: "var(--th-text-muted)" }}>
                {isResetting
                  ? "Preparando nova semana..."
                  : "Carregando tarefas..."}
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Seletor de dia — mobile */}
            <div className="mb-4 flex gap-1.5 overflow-x-auto sm:hidden">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="flex-shrink-0 rounded-[10px] px-4 py-2 text-xs font-semibold transition-all"
                  style={{
                    background:
                      selectedDay === day ? "var(--th-accent)" : "var(--th-surface)",
                    color:
                      selectedDay === day ? "#ffffff" : "var(--th-text-faint)",
                    border: `1px solid ${selectedDay === day ? "var(--th-accent)" : "var(--th-border)"}`,
                  }}
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
                  tasks={filteredWeekTasks}
                  categories={categories}
                  onEditTask={setEditingTask}
                />
              ))}
            </div>

            {/* Mobile: 1 dia por vez */}
            <div className="sm:hidden">
              <DayColumn
                day={selectedDay}
                tasks={filteredWeekTasks}
                categories={categories}
                onEditTask={setEditingTask}
              />
            </div>

            {/* Drag overlay */}
            <DragOverlay>
              {activeTask && (
                <div
                  className="rounded-xl glass p-2.5 pl-3.5"
                  style={{ boxShadow: "var(--th-shadow-elevated)" }}
                >
                  <p className="text-xs" style={{ color: "var(--th-text)" }}>
                    {activeTask.title}
                  </p>
                </div>
              )}
            </DragOverlay>

            {/* Barra de progresso semanal */}
            <div className="mt-6 glass rounded-xl p-4" role="status" aria-label={`Progresso semanal: ${progressPercent}%`}>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--th-text-sub)" }}
                >
                  Progresso semanal
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--th-text-faint)" }}>
                  {completedItems}/{totalItems}{" "}
                  <span style={{ color: "var(--th-accent)" }}>
                    {progressPercent}%
                  </span>
                </span>
              </div>
              <div
                className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: "var(--th-surface-raised)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                    background:
                      progressPercent === 100
                        ? "var(--th-check-progress)"
                        : `linear-gradient(to right, color-mix(in srgb, var(--th-accent) 40%, transparent), color-mix(in srgb, var(--th-accent) 70%, transparent))`,
                  }}
                />
              </div>
            </div>

            {/* Seção de tarefas agendadas — abaixo do progresso */}
            <ScheduledSection
              tasks={filteredScheduledTasks}
              categories={categories}
              onEditTask={setEditingTask}
            />
          </DndContext>
        )}
      </div>

      {showCreateForm && (
        <CreateTaskForm onClose={() => setShowCreateForm(false)} />
      )}

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
