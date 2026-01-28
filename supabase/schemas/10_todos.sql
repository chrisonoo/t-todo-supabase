-- supabase/schemas/10_todos.sql

-- Table: To Do items with an optional note
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  note text,
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists todos_user_id_idx on public.todos(user_id);

-- Always enable Row Level Security (RLS)
alter table public.todos enable row level security;

-- Table-level privileges (defense in depth)
-- Remove all privileges from the anonymous role
revoke all on table public.todos from anon;

-- Allow authenticated users to attempt CRUD, RLS policies still enforce row access
grant select, insert, update, delete on table public.todos to authenticated;

-- Keep full access for service_role (administration and server-side trusted operations)
grant all on table public.todos to service_role;

-- RLS policies (authenticated users only)

-- SELECT: users can read only their own rows
create policy "todos_select_own"
on public.todos
for select
to authenticated
using (user_id = (select auth.uid()));

-- INSERT: users can insert rows only for themselves
create policy "todos_insert_own"
on public.todos
for insert
to authenticated
with check (user_id = (select auth.uid()));

-- UPDATE: users can update only their own rows and must keep ownership
create policy "todos_update_own"
on public.todos
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- DELETE: users can delete only their own rows
create policy "todos_delete_own"
on public.todos
for delete
to authenticated
using (user_id = (select auth.uid()));
