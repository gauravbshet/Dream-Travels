# Supabase Schema Setup

Run the following SQL in your Supabase SQL Editor to set up the tables:

`sql
-- ==========================================
-- Migration: 2026_08_05_fix_destinations_packages_schema.sql
-- ==========================================

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


-- ==========================================
-- Migration: 2026_08_05b_fix_profiles_email_and_admin_read.sql
-- ==========================================

-- ============================================================================
-- Dream Travels: fix profiles.email (Customers tab 400 error) + admin read access
-- Safe to run multiple times.
--
-- Root cause: the admin Customers tab (src/components/admin/CustomersManager.tsx)
-- queries profiles.email, but profiles was only ever created with
-- id / role / full_name / phone / created_at -- email lives in auth.users.
-- Separately, the only RLS policy on profiles allows a user to read their own
-- row, so even after adding the column, an admin couldn't see other customers.
--
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Add the email column and backfill it from auth.users
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

-- ----------------------------------------------------------------------------
-- 2. Keep it in sync going forward: create/update the profile row whenever a
--    new auth user is created, and keep email fresh if it ever changes.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_update();

-- ----------------------------------------------------------------------------
-- 3. Admin helper + read policy, so the Customers tab can see every profile
--    (not just the signed-in admin's own row)
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles" on public.profiles
for select
using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select id, email, full_name, phone, role, created_at from public.profiles;
-- (run as the Supabase SQL Editor / service role, which bypasses RLS)
-- ----------------------------------------------------------------------------


-- ==========================================
-- Migration: 2026_08_05c_finish_updated_at_and_triggers.sql
-- ==========================================

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


-- ==========================================
-- Migration: 2026_08_06_extend_packages_content_fields.sql
-- ==========================================

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


-- ==========================================
-- Migration: 2026_08_07_fix_itineraries_for_daywise_admin.sql
-- ==========================================

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

-- ==========================================
-- Migration: 2026_08_08_add_packages_category_index.sql
-- ==========================================

-- ============================================================================
-- Dream Travels: index packages.category so category-page lookups
-- (GET-by-category from the frontend) don't scan the full table.
-- Supported category values are enforced at the application layer (admin
-- dropdown: solo | group | family | international) rather than a DB CHECK
-- constraint, since existing rows may carry legacy free-text categories.
-- Safe to run multiple times.
-- ============================================================================

create index if not exists idx_packages_category on public.packages (category);


-- ==========================================
-- Migration: 2026_08_09_add_reels_table.sql
-- ==========================================

-- ============================================================================
-- Dream Travels: Travel Reels Showcase.
-- Adds a `reels` table for the customer-facing Reels section + admin
-- management, following the same shape/conventions as `packages` and
-- `destinations` (uuid pk, created_at/updated_at + trigger, plain-text
-- category matching src/data/categories.ts slugs). Safe to run multiple
-- times.
-- ============================================================================

create table if not exists public.reels (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  destination text,
  description text,
  video_url text not null,
  thumbnail_url text,
  instagram_url text,
  category text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep this additive/idempotent like the other schema-fix migrations, in
-- case the table already exists from a partial prior run.
alter table public.reels
  add column if not exists title text,
  add column if not exists destination text,
  add column if not exists description text,
  add column if not exists video_url text,
  add column if not exists thumbnail_url text,
  add column if not exists instagram_url text,
  add column if not exists category text,
  add column if not exists is_active boolean default true,
  add column if not exists display_order int default 0,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- Category values are enforced at the application layer (admin dropdown)
-- rather than a DB CHECK constraint, matching the approach taken for
-- packages.category -- see 2026_08_08_add_packages_category_index.sql.

drop trigger if exists set_reels_updated_at on public.reels;
create trigger set_reels_updated_at
  before update on public.reels
  for each row execute function public.set_updated_at();

create index if not exists idx_reels_is_active on public.reels (is_active);
create index if not exists idx_reels_category on public.reels (category);
create index if not exists idx_reels_display_order on public.reels (display_order);

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select column_name, data_type from information_schema.columns
--   where table_schema = 'public' and table_name = 'reels'
--   order by ordinal_position;
-- ----------------------------------------------------------------------------


-- ==========================================
-- Migration: 2026_08_10_add_reels_rls_policies.sql
-- ==========================================

-- ============================================================================
-- Dream Travels: reels RLS policies.
--
-- The `reels` table has row-level security enabled with no policies, which
-- blocks every insert/update/delete from the admin UI ("new row violates
-- row-level security policy for table reels"). Fix by granting public read
-- (same as every other content table -- see SUPABASE_TABLES_AND_POLICIES.md
-- section 2.4) and admin-only writes via the existing public.is_admin()
-- helper (see 2026_08_05b_fix_profiles_email_and_admin_read.sql). Safe to
-- run multiple times.
-- ============================================================================

alter table public.reels enable row level security;

drop policy if exists "Public read" on public.reels;
create policy "Public read" on public.reels
for select
using (true);

drop policy if exists "Admins can write reels" on public.reels;
create policy "Admins can write reels" on public.reels
for all
using (public.is_admin())
with check (public.is_admin());


-- ==========================================
-- Migration: 2026_08_13_add_budget_tiers_table.sql
-- ==========================================

-- ============================================================================
-- Dream Travels: Budget Friendly tiers.
--
-- The homepage "Budget Friendly" section and the admin "Budget tiers" manager
-- (src/components/admin/BudgetTiersManager.tsx) both already assume a
-- `budget_tiers` table exists, but no migration ever created it -- so the
-- section always fell back to hardcoded static data and never reflected
-- admin edits or real package prices. This adds the table, RLS policies
-- (same pattern as `reels`, see 2026_08_09/2026_08_10), and seeds the
-- current default tiers so the section keeps working out of the box.
-- Safe to run multiple times.
-- ============================================================================

create table if not exists public.budget_tiers (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  emoji text not null,
  price_limit numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_budget_tiers_updated_at on public.budget_tiers;
create trigger set_budget_tiers_updated_at
  before update on public.budget_tiers
  for each row execute function public.set_updated_at();

create index if not exists idx_budget_tiers_price_limit on public.budget_tiers (price_limit);

alter table public.budget_tiers enable row level security;

drop policy if exists "Public read" on public.budget_tiers;
create policy "Public read" on public.budget_tiers
for select
using (true);

drop policy if exists "Admins can write budget tiers" on public.budget_tiers;
create policy "Admins can write budget tiers" on public.budget_tiers
for all
using (public.is_admin())
with check (public.is_admin());

-- Seed the default tiers, sized to the actual spread of package prices in
-- this app (roughly ₹2k - ₹35k) so the "verified packages" counts on the
-- homepage aren't all zero or all full on a fresh database.
insert into public.budget_tiers (title, emoji, price_limit)
select * from (
  values
    ('Under ₹5,000', '🏕', 5000),
    ('Under ₹10,000', '🚐', 10000),
    ('Under ₹20,000', '🏞', 20000),
    ('Premium Under ₹50,000', '✨', 50000)
) as seed(title, emoji, price_limit)
where not exists (select 1 from public.budget_tiers);

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select id, title, emoji, price_limit from public.budget_tiers order by price_limit;
-- ----------------------------------------------------------------------------


-- ==========================================
-- Migration: 2026_08_13b_add_reels_featured_widget_flag.sql
-- ==========================================

-- ============================================================================
-- Dream Travels: floating reel widget "featured" flag.
--
-- src/components/widgets/DreamTravelsReelWidget.tsx and
-- src/components/admin/ReelsManager.tsx already read/write
-- `reels.is_featured_widget`, but no migration ever added the column --
-- so in a real database the widget's query silently errors and falls back
-- to the first static reel, and the admin "Feature on Widget" toggle only
-- updates local state instead of persisting. Adds the missing column,
-- backed by a partial unique index so at most one reel can be featured at
-- a time (mirrors the "un-feature everything else" logic already done in
-- ReelsManager.handleSetFeaturedWidget). Safe to run multiple times.
-- ============================================================================

alter table public.reels
  add column if not exists is_featured_widget boolean not null default false;

create unique index if not exists idx_reels_single_featured_widget
  on public.reels (is_featured_widget)
  where is_featured_widget;

create index if not exists idx_reels_is_featured_widget on public.reels (is_featured_widget);

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select id, title, is_featured_widget from public.reels where is_featured_widget;
-- ----------------------------------------------------------------------------


-- ==========================================
-- Migration: 2026_08_14_add_display_order_to_packages_destinations.sql
-- ==========================================

-- ============================================================================
-- Dream Travels: manual display order for packages & destinations.
--
-- Admins need to control the order packages/destinations appear in on the
-- homepage and listing pages (e.g. "Featured Packages", "Popular
-- Destinations"), independent of price/rating/created_at. Adds a
-- `display_order` column to both tables, following the same convention
-- already used by `reels.display_order` (see 2026_08_09_add_reels_table.sql):
-- lower numbers sort first, defaults to 0 so existing rows are unaffected
-- until an admin sets an explicit order. Safe to run multiple times.
-- ============================================================================

alter table public.packages
  add column if not exists display_order int not null default 0;

alter table public.destinations
  add column if not exists display_order int not null default 0;

create index if not exists idx_packages_display_order on public.packages (display_order);
create index if not exists idx_destinations_display_order on public.destinations (display_order);

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select column_name, data_type from information_schema.columns
--   where table_schema = 'public' and table_name in ('packages','destinations')
--   and column_name = 'display_order';
-- ----------------------------------------------------------------------------

`
