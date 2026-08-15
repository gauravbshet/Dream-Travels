-- ============================================================================
-- Dream Travels: link reels to a bookable package.
--
-- The Travel Reels Showcase had no way to tell visitors which package a reel
-- was advertising, so there was no "Book Now" path directly under a reel.
-- Adds `reels.package_id`, a foreign key into `packages`, so admins can tag
-- a reel with the trip it's showing and the storefront can render that
-- package's price/duration + a Book Now CTA under the reel card. Nullable:
-- reels without a linked package just render without the footer. Safe to
-- run multiple times.
-- ============================================================================

alter table public.reels
  add column if not exists package_id uuid references public.packages (id) on delete set null;

create index if not exists idx_reels_package_id on public.reels (package_id);

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select r.title, p.title as package_title
--   from public.reels r left join public.packages p on p.id = r.package_id;
-- ----------------------------------------------------------------------------
