-- ============================================================================
-- Dream Travels: finish the remaining pieces on destinations/packages
-- (updated_at columns, auto-update triggers, slug uniqueness, indexes).
-- Safe to run multiple times.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. updated_at columns
-- ----------------------------------------------------------------------------
alter table public.destinations
  add column if not exists updated_at timestamptz default now();

alter table public.packages
  add column if not exists updated_at timestamptz default now();

-- ----------------------------------------------------------------------------
-- 2. slug uniqueness (won't fail the whole script if duplicates exist --
--    it'll just leave a notice telling you to dedupe by hand)
-- ----------------------------------------------------------------------------
do $$
begin
  alter table public.destinations add constraint destinations_slug_unique unique (slug);
exception
  when duplicate_table then null;
  when unique_violation then
    raise notice 'destinations.slug has duplicate values -- resolve manually before adding the unique constraint';
end $$;

do $$
begin
  alter table public.packages add constraint packages_slug_unique unique (slug);
exception
  when duplicate_table then null;
  when unique_violation then
    raise notice 'packages.slug has duplicate values -- resolve manually before adding the unique constraint';
end $$;

-- ----------------------------------------------------------------------------
-- 3. auto-update updated_at on every row edit
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_destinations_updated_at on public.destinations;
create trigger set_destinations_updated_at
  before update on public.destinations
  for each row execute function public.set_updated_at();

drop trigger if exists set_packages_updated_at on public.packages;
create trigger set_packages_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. helpful indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_packages_destination_id on public.packages (destination_id);
create index if not exists idx_packages_slug on public.packages (slug);
create index if not exists idx_destinations_slug on public.destinations (slug);
create index if not exists idx_destinations_is_featured on public.destinations (is_featured) where is_featured = true;

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select column_name, data_type from information_schema.columns
--   where table_schema = 'public' and table_name in ('destinations','packages')
--   order by table_name, ordinal_position;
-- ----------------------------------------------------------------------------
