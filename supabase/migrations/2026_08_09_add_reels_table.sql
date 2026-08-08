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
