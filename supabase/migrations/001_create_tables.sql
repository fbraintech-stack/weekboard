-- WeekBoard: Migração inicial
-- Tabelas: categories, tasks
-- RLS: Habilitado com policies por user_id

-- ============================================
-- TABELA: categories
-- ============================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#3B82F6',
  created_at timestamptz not null default now()
);

-- Index para queries por usuário
create index idx_categories_user_id on public.categories(user_id);

-- RLS
alter table public.categories enable row level security;

-- Policy: usuário só vê suas próprias categorias
create policy "Usuário vê suas categorias"
  on public.categories for select
  using (auth.uid() = user_id);

-- Policy: usuário só insere suas próprias categorias
create policy "Usuário cria suas categorias"
  on public.categories for insert
  with check (auth.uid() = user_id);

-- Policy: usuário só edita suas próprias categorias
create policy "Usuário edita suas categorias"
  on public.categories for update
  using (auth.uid() = user_id);

-- Policy: usuário só deleta suas próprias categorias
create policy "Usuário deleta suas categorias"
  on public.categories for delete
  using (auth.uid() = user_id);

-- ============================================
-- TABELA: tasks
-- ============================================
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  type text not null check (type in ('recurrent', 'oneoff')),
  days integer[] not null default '{}',
  completed boolean not null default false,
  week_year text not null,
  carry_over boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes para queries frequentes
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_week_year on public.tasks(week_year);
create index idx_tasks_user_week on public.tasks(user_id, week_year);

-- RLS
alter table public.tasks enable row level security;

-- Policy: usuário só vê suas próprias tarefas
create policy "Usuário vê suas tarefas"
  on public.tasks for select
  using (auth.uid() = user_id);

-- Policy: usuário só insere suas próprias tarefas
create policy "Usuário cria suas tarefas"
  on public.tasks for insert
  with check (auth.uid() = user_id);

-- Policy: usuário só edita suas próprias tarefas
create policy "Usuário edita suas tarefas"
  on public.tasks for update
  using (auth.uid() = user_id);

-- Policy: usuário só deleta suas próprias tarefas
create policy "Usuário deleta suas tarefas"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- ============================================
-- CATEGORIAS PADRÃO (inseridas via trigger)
-- ============================================
-- Função que cria categorias padrão quando um usuário se cadastra
create or replace function public.create_default_categories()
returns trigger as $$
begin
  insert into public.categories (user_id, name, color) values
    (new.id, 'Trabalho', '#3B82F6'),
    (new.id, 'Casa', '#22C55E'),
    (new.id, 'Pessoal', '#A855F7');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: quando um novo usuário é criado, cria categorias padrão
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_default_categories();
