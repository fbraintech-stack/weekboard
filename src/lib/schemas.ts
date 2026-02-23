import { z } from "zod/v4";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100),
  type: z.enum(["recurrent", "oneoff"]),
  days: z.array(z.number().min(1).max(7)).min(1, "Selecione pelo menos 1 dia"),
  category_id: z.string().uuid().nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(30),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
