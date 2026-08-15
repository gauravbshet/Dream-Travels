-- ============================================================================
-- Dream Travels: admin-set departure dates for bookings.
--
-- `packages.dates` is a freeform display label ("Ongoing", "Sep 10 - Sep 16")
-- shown on package cards — it was never a source of truth a customer could
-- actually pick from. Booking forms let anyone type any date, so an admin
-- had no way to constrain enquiries to dates a trip is actually running.
--
-- Adds `available_dates`, an explicit list of admin-set departure dates.
-- Nullable/empty: packages with no dates set fall back to the existing free
-- date input, so this ships without breaking any package that hasn't been
-- updated yet. Safe to run multiple times.
-- ============================================================================

alter table public.packages
  add column if not exists available_dates date[];

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select title, dates, available_dates from public.packages limit 20;
-- ----------------------------------------------------------------------------
