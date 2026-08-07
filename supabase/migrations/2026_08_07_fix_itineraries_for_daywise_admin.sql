-- ============================================================================
-- Dream Travels: ensure itineraries table supports the day-wise admin workflow
-- ============================================================================

create table if not exists public.itineraries (
    id uuid primary key default gen_random_uuid (),
    package_id uuid references public.packages (id) on delete cascade,
    day integer not null default 1,
    title text not null default 'Day 1',
    description text,
    stay_location text,
    stay_type text,
    meals text,
    image text,
    optional_note text,
    created_at timestamptz not null default now()
);

alter table public.itineraries
add column if not exists package_id uuid,
add column if not exists day integer,
add column if not exists title text,
add column if not exists description text,
add column if not exists stay_location text,
add column if not exists stay_type text,
add column if not exists meals text,
add column if not exists image text,
add column if not exists optional_note text,
add column if not exists created_at timestamptz default now();

alter table public.itineraries
alter column day
set default 1,
alter column title
set default 'Day 1';

create index if not exists idx_itineraries_package_id on public.itineraries (package_id);

create index if not exists idx_itineraries_day on public.itineraries (day);

-- If RLS is enabled in your project and the admin UI is blocked, apply policies
-- that allow authenticated admins to manage itinerary rows.
--
-- Example (run in Supabase SQL editor if needed):
-- alter table public.itineraries enable row level security;
-- create policy "Admins can manage itineraries" on public.itineraries
--   for all using (public.is_admin()) with check (public.is_admin());
-- create policy "Authenticated users can read itineraries" on public.itineraries
--   for select using (auth.role() = 'authenticated');