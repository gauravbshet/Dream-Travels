-- ============================================================================
-- Dream Travels: extend packages with content fields needed for a full
-- package detail page (highlights, inclusions/exclusions, FAQ, trip facts,
-- publish status). Safe to run multiple times.
-- ============================================================================

alter table public.packages
  add column if not exists highlights text[] default '{}',
  add column if not exists inclusions text[] default '{}',
  add column if not exists exclusions text[] default '{}',
  add column if not exists faq jsonb default '[]'::jsonb,
  add column if not exists status text default 'published',
  add column if not exists difficulty text,
  add column if not exists drop_point text,
  add column if not exists best_time text,
  add column if not exists languages text[] default '{}',
  add column if not exists travel_type text,
  add column if not exists max_group_size int,
  add column if not exists transport text,
  add column if not exists accommodation text,
  add column if not exists meals text;

-- Keep existing rows visible on the public site.
update public.packages set status = 'published' where status is null;

do $$
begin
  alter table public.packages add constraint packages_status_check check (status in ('draft', 'published'));
exception
  when duplicate_object then null;
end $$;

create index if not exists idx_packages_status on public.packages (status);

-- ----------------------------------------------------------------------------
-- itineraries: stay/meal details per day, for the day-wise timeline UI
-- ----------------------------------------------------------------------------
alter table public.itineraries
  add column if not exists stay_location text,
  add column if not exists stay_type text,
  add column if not exists meals text,
  add column if not exists image text,
  add column if not exists optional_note text;

create index if not exists idx_itineraries_package_id on public.itineraries (package_id);

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select column_name, data_type from information_schema.columns
--   where table_schema = 'public' and table_name = 'packages'
--   order by ordinal_position;
-- ----------------------------------------------------------------------------
