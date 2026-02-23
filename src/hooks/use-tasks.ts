"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types/task";
import type { CreateTaskInput } from "@/lib/schemas";
import { getCurrentWeekYear } from "@/lib/utils";

export function useTasks() {
  const supabase = createClient();
  const weekYear = getCurrentWeekYear();

  return useQuery<Task[]>({
    queryKey: ["tasks", weekYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("week_year", weekYear)
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

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...input,
          user_id: user.id,
          week_year: weekYear,
          completed: false,
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
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", weekYear] });
      const previous = queryClient.getQueryData<Task[]>(["tasks", weekYear]);

      queryClient.setQueryData<Task[]>(["tasks", weekYear], (old) =>
        old?.map((t) => (t.id === id ? { ...t, completed } : t))
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
