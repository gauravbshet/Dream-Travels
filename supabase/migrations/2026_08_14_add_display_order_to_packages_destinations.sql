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
