"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentWeekYear, getPreviousWeekYear } from "@/lib/utils";
import type { Task } from "@/types/task";

interface ResetResult {
  recurrentReset: number;
  carryOver: number;
  removed: number;
}

export function useWeeklyReset() {
  const [resetResult, setResetResult] = useState<ResetResult | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    checkAndReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAndReset() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const currentWeek = getCurrentWeekYear();
    const previousWeek = getPreviousWeekYear();

    // Verificar se já existem tarefas para esta semana
    const { data: currentTasks } = await supabase
      .from("tasks")
      .select("id")
      .eq("user_id", user.id)
      .eq("week_year", currentWeek)
      .limit(1);

    // Se já existem tarefas para esta semana, não fazer nada
    if (currentTasks && currentTasks.length > 0) return;

    // Buscar tarefas da semana anterior
    const { data: prevTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("week_year", previousWeek);

    if (!prevTasks || prevTasks.length === 0) return;

    setIsResetting(true);

    const newTasks: Omit<Task, "id" | "created_at" | "updated_at">[] = [];
    let recurrentReset = 0;
    let carryOver = 0;
    let removed = 0;

    for (const task of prevTasks) {
      if (task.type === "recurrent") {
        // Recorrentes: sempre voltam como pendentes
        newTasks.push({
          user_id: user.id,
          category_id: task.category_id,
          title: task.title,
          type: "recurrent",
          days: task.days,
          completed: false,
          week_year: currentWeek,
          carry_over: false,
        });
        recurrentReset++;
      } else if (task.type === "oneoff") {
        if (task.completed) {
          // Pontuais concluídas: somem
          removed++;
        } else {
          // Pontuais não concluídas: carry-over
          newTasks.push({
            user_id: user.id,
            category_id: task.category_id,
            title: task.title,
            type: "oneoff",
            days: task.days,
            completed: false,
            week_year: currentWeek,
            carry_over: true,
          });
          carryOver++;
        }
      }
    }

    // Inserir novas tarefas no Supabase
    if (newTasks.length > 0) {
      await supabase.from("tasks").insert(newTasks);
    }

    // Invalidar cache para atualizar o board
    queryClient.invalidateQueries({ queryKey: ["tasks", currentWeek] });

    setResetResult({ recurrentReset, carryOver, removed });
    setIsResetting(false);
  }

  const dismissNotification = () => setResetResult(null);

  return { resetResult, isResetting, dismissNotification };
}
