-- ============================================================================
-- Dream Travels: add map fields to destinations (Explore by Map dynamic data)
--
-- lat/lng are auto-filled by the admin form via server-side geocoding
-- (src/app/api/geocode/route.ts) when a destination is saved - the admin
-- never types coordinates by hand. `region` is set manually from a fixed
-- dropdown in the admin form since it's a business categorization, not
-- something geocoding can infer. `state` is auto-filled from the geocode
-- result too, but stays editable in case the lookup gets it wrong.
--
-- Destinations without lat/lng are simply skipped from the map (see
-- src/app/page.tsx), so this is safe to run before any destination has
-- been re-saved through the updated admin form.
--
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

alter table public.destinations
  add column if not exists lat numeric,
  add column if not exists lng numeric,
  add column if not exists region text,
  add column if not exists state text;

-- Keep `region` constrained to the same 5 values the map UI groups by, so a
-- typo or manual SQL edit can't silently break the "Where We Run Trips" list.
alter table public.destinations drop constraint if exists destinations_region_check;
alter table public.destinations add constraint destinations_region_check
  check (region is null or region in ('Himalayas', 'Northeast', 'West Coast', 'Western Ghats', 'Islands'));
