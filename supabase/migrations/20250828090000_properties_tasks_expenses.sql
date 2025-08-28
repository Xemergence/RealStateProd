create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  address_line text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  size_sqft integer,
  bedrooms smallint,
  bathrooms numeric,
  year_built smallint,
  purchase_price numeric,
  est_value numeric,
  monthly_rent numeric,
  occupancy_rate numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.property_members (
  property_id uuid references public.properties(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','tenant')),
  created_at timestamptz not null default now(),
  primary key(property_id, user_id)
);

create table if not exists public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'open',
  priority text not null default 'medium',
  owner_estimate numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.maintenance_requests_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists maintenance_requests_set_updated_at on public.maintenance_requests;
create trigger maintenance_requests_set_updated_at before update on public.maintenance_requests for each row execute procedure public.maintenance_requests_set_updated_at();

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  amount numeric not null,
  note text,
  incurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create or replace function public.add_owner_membership() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then
    insert into public.property_members(property_id, user_id, role)
    values (new.id, auth.uid(), 'owner')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists properties_add_owner_membership on public.properties;
create trigger properties_add_owner_membership after insert on public.properties for each row execute procedure public.add_owner_membership();

alter table public.properties enable row level security;
alter table public.property_members enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "members can view properties" on public.properties;
create policy "members can view properties" on public.properties for select using (
  exists (
    select 1 from public.property_members m
    where m.property_id = id and m.user_id = auth.uid()
  )
);

drop policy if exists "owners can insert properties" on public.properties;
create policy "owners can insert properties" on public.properties for insert with check (auth.uid() is not null);


drop policy if exists "users manage own membership" on public.property_members;
create policy "users manage own membership" on public.property_members for all using (user_id = auth.uid()) with check (user_id = auth.uid());


drop policy if exists "members can view requests" on public.maintenance_requests;
create policy "members can view requests" on public.maintenance_requests for select using (
  exists (
    select 1 from public.property_members m
    where m.property_id = maintenance_requests.property_id and m.user_id = auth.uid()
  )
);

drop policy if exists "tenants can create requests" on public.maintenance_requests;
create policy "tenants can create requests" on public.maintenance_requests for insert with check (
  exists (
    select 1 from public.property_members m
    where m.property_id = maintenance_requests.property_id and m.user_id = auth.uid() and m.role = 'tenant'
  ) and created_by = auth.uid()
);


drop policy if exists "owners can update estimate and status" on public.maintenance_requests;
create policy "owners can update estimate and status" on public.maintenance_requests for update using (
  exists (
    select 1 from public.property_members m
    where m.property_id = maintenance_requests.property_id and m.user_id = auth.uid() and m.role = 'owner'
  )
) with check (
  exists (
    select 1 from public.property_members m
    where m.property_id = maintenance_requests.property_id and m.user_id = auth.uid() and m.role = 'owner'
  )
);


drop policy if exists "owners manage expenses" on public.expenses;
create policy "owners manage expenses" on public.expenses for all using (
  exists (
    select 1 from public.property_members m
    where m.property_id = expenses.property_id and m.user_id = auth.uid() and m.role = 'owner'
  )
) with check (
  exists (
    select 1 from public.property_members m
    where m.property_id = expenses.property_id and m.user_id = auth.uid() and m.role = 'owner'
  ) and user_id = auth.uid()
);

alter publication supabase_realtime add table public.properties;
alter publication supabase_realtime add table public.property_members;
alter publication supabase_realtime add table public.maintenance_requests;
alter publication supabase_realtime add table public.expenses;