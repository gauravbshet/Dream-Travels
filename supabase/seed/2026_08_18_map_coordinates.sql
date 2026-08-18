-- ============================================================================
-- Explore-by-map: fill in the missing coordinates and regions
-- ============================================================================
-- The map on the homepage was showing a single pin. It wasn't a rendering bug
-- — the homepage query is:
--
--     .select("...,region,state,lat,lng")
--     .not("lat", "is", null)
--     .not("lng", "is", null)
--
-- and the result is then filtered again to rows whose `region` is one of
-- Himalayas / Northeast / Western Ghats / West Coast / Islands.
--
-- Of ten destinations, only `tawang-arunachal-pradesh-explorer` satisfied
-- both conditions, so exactly one pin was drawn. `bandaje-trek-samse` had
-- perfectly good coordinates but a null region, so it was silently dropped;
-- the other eight had no coordinates at all.
--
-- This backfills both. Every value is the town or landmark centroid for the
-- real place. The map renders all of India in roughly a thousand pixels, so
-- town-level precision is comfortably sub-pixel — but do glance at the pins
-- after running this and nudge any that look off.
--
-- Idempotent: re-running just rewrites the same values.
-- Run this in the Supabase SQL editor.
-- ============================================================================

-- Has coordinates already; only the region was missing, which is why it never
-- appeared despite being fully mapped.
update public.destinations
   set region = 'Western Ghats'
 where slug = 'bandaje-trek-samse';

-- Chikkamagaluru town, Karnataka.
update public.destinations
   set lat = 13.3161, lng = 75.7720
 where slug = 'chikkamagaluru-coffee-clouds-mountains';

-- Dudhsagar Falls, on the Goa–Karnataka border.
update public.destinations
   set lat = 15.3144, lng = 74.3143, region = 'Western Ghats'
 where slug = 'dudhsagar-magod-falls';

-- Srinagar, the usual arrival point for the Kashmir trips.
update public.destinations
   set lat = 34.0837, lng = 74.7973
 where slug = 'kashmir';

-- Kudremukh, Karnataka.
update public.destinations
   set lat = 13.1340, lng = 75.2660, region = 'Western Ghats'
 where slug = 'kudremukha-trek-samse-exploration';

-- Kurinjal Peak, just north of Kudremukh.
update public.destinations
   set lat = 13.2200, lng = 75.2500, region = 'Western Ghats'
 where slug = 'kurinjal-peak-trek-samse-exploration';

-- Leh, the arrival point for the Ladakh trip.
update public.destinations
   set lat = 34.1526, lng = 77.5771
 where slug = 'ladakh-grand-explore';

-- Pune, gateway to the Sahyadri monsoon routes.
update public.destinations
   set lat = 18.5204, lng = 73.8567
 where slug = 'maharashtra-ultimate-monsoon-adventure';

-- Shillong, Meghalaya.
update public.destinations
   set lat = 25.5788, lng = 91.8933
 where slug = 'meghalaya-adventure-waterfalls-living-root-bridges';

-- ----------------------------------------------------------------------------
-- Verify: every row below should have a lat, an lng and one of the five
-- regions. Anything still null stays off the map.
-- ----------------------------------------------------------------------------
-- select slug, region, lat, lng
--   from public.destinations
--  order by (lat is null), region, slug;
--
-- Valid regions, from src/data/map.ts:
--   Himalayas | Northeast | Western Ghats | West Coast | Islands
-- A destination with any other value, or null, will not be drawn.
