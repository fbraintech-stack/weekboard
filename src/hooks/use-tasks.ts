"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Task, DayOfWeek } from "@/types/task";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/schemas";
import { getCurrentWeekYear, getWeekYear } from "@/lib/utils";

export function useTasks() {
  const supabase = createClient();
  const weekYear = getCurrentWeekYear();

  return useQuery<Task[]>({
    queryKey: ["tasks", weekYear],
    queryFn: async () => {
      // Buscar tarefas da semana atual + todas as agendadas (qualquer semana)
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .or(`week_year.eq.${weekYear},type.eq.scheduled`)
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const weekYear = getCurrentWeekYear();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Computar week_year a partir da data agendada, se fornecida
      const taskWeekYear = input.scheduled_date
        ? getWeekYear(new Date(input.scheduled_date + "T12:00:00"))
        : weekYear;

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...input,
          scheduled_date: input.scheduled_date || null,
          user_id: user.id,
          week_year: taskWeekYear,
          completed_days: [],
          carry_over: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", weekYear] });
    },
  });
}

export function useToggleTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const weekYear = getCurrentWeekYear();

  return useMutation({
    mutationFn: async ({
      id,
      day,
      completed,
    }: {
      id: string;
      day: DayOfWeek;
      completed: boolean;
    }) => {
      // Buscar tarefa atual para modificar o array
      const { data: task, error: fetchError } = await supabase
        .from("tasks")
        .select("completed_days")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const currentDays: number[] = task.completed_days || [];
      const newCompletedDays = completed
        ? [...new Set([...currentDays, day])]
        : currentDays.filter((d: number) => d !== day);

      const { error } = await supabase
        .from("tasks")
        .update({
          completed_days: newCompletedDays,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onMutate: async ({ id, day, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", weekYear] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", weekYear]);

      queryClient.setQueryData<Task[]>(["tasks", weekYear], (old) =>
        old?.map((t) => {
          if (t.id !== id) return t;
          const currentDays = t.completed_days || [];
          const newCompletedDays = completed
            ? [...new Set([...currentDays, day])]
            : currentDays.filter((d) => d !== day);
          return { ...t, completed_days: newCompletedDays };
        })
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", weekYear], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", weekYear] });
    },
  });
}

export function useUpdateTaskDays() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const weekYear = getCurrentWeekYear();

  return useMutation({
    mutationFn: async ({
      id,
      days,
    }: {
      id: string;
      days: DayOfWeek[];
    }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ days, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onMutate: async ({ id, days }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", weekYear] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", weekYear]);

      queryClient.setQueryData<Task[]>(["tasks", weekYear], (old) =>
        old?.map((t) => (t.id === id ? { ...t, days } : t))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", weekYear], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", weekYear] });
    },
  });
}

export function useUpdateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const weekYear = getCurrentWeekYear();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateTaskInput & { id: string }) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onMutate: async ({ id, ...input }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", weekYear] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", weekYear]);

      queryClient.setQueryData<Task[]>(["tasks", weekYear], (old) =>
        old?.map((t) =>
          t.id === id
            ? { ...t, ...input, days: input.days as DayOfWeek[] }
            : t
        )
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", weekYear], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", weekYear] });
    },
  });
}

export function useDeleteTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const weekYear = getCurrentWeekYear();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", weekYear] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", weekYear]);

      queryClient.setQueryData<Task[]>(["tasks", weekYear], (old) =>
        old?.filter((t) => t.id !== id)
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", weekYear], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", weekYear] });
    },
  });
}
