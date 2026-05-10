
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- TRIPS
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  destination text,
  description text,
  cover_url text,
  start_date date,
  end_date date,
  travelers int default 1,
  status text default 'planned',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trips enable row level security;
create policy "trips_owner_all" on public.trips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "trips_public_read" on public.trips for select using (is_public = true);
create index trips_user_idx on public.trips(user_id);

-- STOPS
create table public.stops (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  country text,
  arrival_date date,
  departure_date date,
  position int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.stops enable row level security;
create policy "stops_owner_all" on public.stops for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "stops_public_read" on public.stops for select using (exists (select 1 from public.trips t where t.id = stops.trip_id and t.is_public = true));
create index stops_trip_idx on public.stops(trip_id);

-- ACTIVITIES
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  stop_id uuid references public.stops(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  cost numeric default 0,
  currency text default 'USD',
  duration_minutes int,
  scheduled_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.activities enable row level security;
create policy "activities_owner_all" on public.activities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "activities_public_read" on public.activities for select using (exists (select 1 from public.trips t where t.id = activities.trip_id and t.is_public = true));
create index activities_trip_idx on public.activities(trip_id);

-- PACKING
create table public.packing_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text default 'general',
  packed boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.packing_items enable row level security;
create policy "packing_owner_all" on public.packing_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- NOTES
create table public.trip_notes (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  day_date date,
  title text,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trip_notes enable row level security;
create policy "notes_owner_all" on public.trip_notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
