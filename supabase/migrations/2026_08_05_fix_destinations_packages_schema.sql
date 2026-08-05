-- ============================================================================
-- Dream Travels: fix destinations/packages schema drift
-- Safe to run multiple times. Adds missing columns without dropping any
-- existing column or data. Backfills the canonical columns from whichever
-- legacy columns happen to exist on your live table.
--
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. destinations: unify on name / slug / description / cover_image / image /
--    price / rating / is_featured / updated_at
--    (this is the schema src/app/page.tsx, src/app/destinations/[slug]/page.tsx,
--    and the admin package-destination dropdown already assume)
-- ----------------------------------------------------------------------------
alter table public.destinations
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists cover_image text,
  add column if not exists image text,
  add column if not exists price numeric,
  add column if not exists rating numeric,
  add column if not exists is_featured boolean default false,
  add column if not exists updated_at timestamptz default now();

-- Backfill from legacy columns if this table was created with the older
-- title/country/categories/photo_url shape.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'destinations' and column_name = 'title'
  ) then
    update public.destinations set name = coalesce(name, title) where name is null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'destinations' and column_name = 'photo_url'
  ) then
    update public.destinations set image = coalesce(image, photo_url) where image is null;
    update public.destinations set cover_image = coalesce(cover_image, photo_url) where cover_image is null;
  end if;
end $$;

-- Fill in any name that is still null so the not-null/slug step below is safe.
update public.destinations
set name = 'Untitled destination ' || id::text
where name is null;

-- Generate slugs for rows that don't have one yet.
update public.destinations
set slug = lower(regexp_replace(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')) || '-' || substr(id::text, 1, 8)
where slug is null or slug = '';

alter table public.destinations alter column name set not null;

-- Add a uniqueness guarantee on slug, but don't fail the whole script if
-- duplicates somehow exist -- surface a notice instead so you can fix by hand.
do $$
begin
  alter table public.destinations add constraint destinations_slug_unique unique (slug);
exception
  when duplicate_table then null; -- constraint already exists
  when unique_violation then
    raise notice 'destinations.slug has duplicate values -- resolve manually before adding the unique constraint';
end $$;

-- ----------------------------------------------------------------------------
-- 2. packages: add the fields the public package pages already read
--    (location, category, pickup, dates, original_price, rating, reviews,
--    is_top_pick) plus slug + updated_at
-- ----------------------------------------------------------------------------
alter table public.packages
  add column if not exists slug text,
  add column if not exists location text,
  add column if not exists category text,
  add column if not exists pickup text,
  add column if not exists dates text,
  add column if not exists original_price numeric,
  add column if not exists rating numeric,
  add column if not exists reviews int,
  add column if not exists is_top_pick boolean default false,
  add column if not exists additional_images text[],
  add column if not exists updated_at timestamptz default now();

update public.packages
set slug = lower(regexp_replace(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')) || '-' || substr(id::text, 1, 8)
where slug is null or slug = '';

do $$
begin
  alter table public.packages add constraint packages_slug_unique unique (slug);
exception
  when duplicate_table then null;
  when unique_violation then
    raise notice 'packages.slug has duplicate values -- resolve manually before adding the unique constraint';
end $$;

-- ----------------------------------------------------------------------------
-- 3. updated_at triggers, so edits in admin keep updated_at accurate
--    (used for "recently updated" ordering on the home page)
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
