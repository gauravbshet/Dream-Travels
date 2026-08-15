-- ============================================================================
-- Gangadikal Trek & Samse Exploration -- 2D / 1N
-- ============================================================================
-- Promotes the `gangadikallu-3899` placeholder (added as a draft in
-- 2026_08_15_real_destination_packages.sql with only a name and a price) into
-- a complete, publishable package.
--
-- Every detail below comes from the operator's own itinerary -- the pickup
-- times, the hour-by-hour trek schedule, the Day 2 stops, the highlights.
-- Nothing is inferred. Fields the operator did not specify (meals, homestay
-- name, group size, difficulty grading) are left null rather than guessed;
-- fill them in via the admin panel once confirmed.
--
-- NOTE ON SPELLING: the draft row was seeded as "Gangadikallu"; the operator
-- writes "Gangadikal". The title below uses the operator's spelling. The slug
-- is deliberately left as `gangadikallu-3899` so the earlier seed file's
-- publish list keeps matching -- rename it later if you want the tidier URL,
-- since this package has never been public and nothing links to it yet.
--
-- Shares its base, homestay and Day 2 route with the Bandaje trek package
-- (2026_08_15b) -- same operator, same valley, different peak.
--
-- Safe to re-run. Run this in the Supabase SQL editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Ensure the itineraries table can be upserted by (package_id, day).
--    Idempotent: no-ops if 2026_08_15b already added the constraint.
-- ----------------------------------------------------------------------------
do $$
begin
  alter table public.itineraries
    add constraint itineraries_package_day_unique unique (package_id, day);
exception
  when duplicate_object then null;
  when duplicate_table then null;
end $$;

-- ----------------------------------------------------------------------------
-- 2. Fill in the real package detail and publish it.
-- ----------------------------------------------------------------------------
update public.packages
set
  title      = 'Gangadikal Trek & Samse Exploration',
  location   = 'Gangadikal & Samse, Karnataka',
  duration   = '2D / 1N',
  pickup     = 'Devagane (11:30 PM) / Shivamogga Bus Stand (2:40 AM)',
  category   = 'group',
  price      = 3899,
  overview   = 'An overnight drive into the Western Ghats, a full day on the '
               'Gangadikal trail with a local guide, and a second day through '
               'Samse -- tea plantations, a hillside temple, and Soormane '
               'Falls -- before the drive home. One night in a homestay, with '
               'a jeep leg to the trek base and back.',
  highlights = array[
    'Guided Gangadikal Trek to the peak',
    'Scenic jeep ride to and from the trek base',
    'Panoramic Western Ghats views from the summit',
    'Samse tea estate walk and photography stop',
    'Sri Ganapati Temple, Samse',
    'Soormane Falls',
    'Overnight homestay stay',
    'Nature and adventure experience'
  ],
  transport  = 'Overnight coach from the pickup point, plus a jeep transfer to '
               'and from the trek base',
  accommodation = 'Homestay (1 night)',
  status     = 'published'
where slug = 'gangadikallu-3899';

-- ----------------------------------------------------------------------------
-- 3. The two-day itinerary, as supplied by the operator.
-- ----------------------------------------------------------------------------
insert into public.itineraries (package_id, day, title, description, stay_location)
values
  (
    (select id from public.packages where slug = 'gangadikallu-3899'), 1,
    'Gangadikal Trek',
    'Pickup at 11:30 PM from Devagane and 2:40 AM from Shivamogga Bus Stand, '
    'travelling overnight towards the trek destination. Arrive at the homestay '
    '6:30-7:00 AM to check in and freshen up, then breakfast from 7:00 to '
    '8:00 AM. Trek preparation follows (8:00-8:30 AM) -- refill water bottles, '
    'pack snacks, rain gear and essentials. A scenic jeep ride (8:30-9:00 AM) '
    'carries the group from the homestay to the trek base, and the Gangadikal '
    'Trek begins at 9:00 AM with an experienced local guide. Between 1:00 and '
    '2:00 PM the group reaches Gangadikal Peak for a packed lunch and '
    'breathtaking panoramic views across the Western Ghats, then descends '
    '(2:00-4:30 PM) and takes the jeep back (4:30-5:00 PM). Evening tea and '
    'snacks from 5:00 PM, with the rest of the evening free at the homestay.',
    'Homestay near the Gangadikal trek base'
  ),
  (
    (select id from public.packages where slug = 'gangadikallu-3899'), 2,
    'Samse & Waterfall Exploration',
    'Breakfast at the homestay and check out. The morning takes in Sri '
    'Ganapati Temple in Samse -- a serene stop in beautiful surroundings -- '
    'followed by a walk through the lush Samse tea plantations, with scenic '
    'views worth the photography stop. From there, on to Soormane Falls for '
    'time around the water and the surrounding nature. Sightseeing wraps in '
    'the evening, and the group proceeds to the designated drop-off point.',
    null
  )
on conflict (package_id, day) do update
set
  title         = excluded.title,
  description   = excluded.description,
  stay_location = excluded.stay_location;

-- ----------------------------------------------------------------------------
-- 4. Verify.
-- ----------------------------------------------------------------------------
-- select slug, title, duration, pickup, price, status
--   from public.packages where slug = 'gangadikallu-3899';
--
-- select day, title, stay_location
--   from public.itineraries
--  where package_id = (select id from public.packages
--                       where slug = 'gangadikallu-3899')
--  order by day;
--
-- Still unconfirmed for this package -- add via the admin panel once known:
--   * meals (what's included across the two days)
--   * the homestay's name
--   * max group size
--   * difficulty grading for the trek
--   * a real photograph (currently sharing a stock Western Ghats image with
--     the other Karnataka trek packages)
