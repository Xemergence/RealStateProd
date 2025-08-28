create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo',
  assignee_user_id uuid references auth.users(id) on delete set null,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_tasks_property_id on tasks(property_id);
create index if not exists idx_tasks_assignee on tasks(assignee_user_id);

alter publication supabase_realtime add table tasks;
