-- WeekBoard: Migração - completed_days
-- Muda completed (boolean) para completed_days (integer[])
-- Permite marcar conclusão independente por dia da semana

-- 1. Adicionar nova coluna
ALTER TABLE public.tasks ADD COLUMN completed_days integer[] NOT NULL DEFAULT '{}';

-- 2. Migrar dados existentes
UPDATE public.tasks
SET completed_days = CASE
  WHEN completed = true THEN days
  ELSE '{}'
END;

-- 3. Remover coluna antiga
ALTER TABLE public.tasks DROP COLUMN completed;
