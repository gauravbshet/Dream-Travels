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
