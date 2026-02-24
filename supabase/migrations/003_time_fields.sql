-- Adicionar campos de horário (início/fim) às tarefas
-- Ambos nullable — horário é opcional
ALTER TABLE public.tasks ADD COLUMN start_time time DEFAULT NULL;
ALTER TABLE public.tasks ADD COLUMN end_time time DEFAULT NULL;
