-- ============================================================================
-- Bandaje Trek & Samse Exploration -- 2D / 1N
-- ============================================================================
-- Promotes the `bandaje-falls-trek-3899` placeholder (added as a draft in
-- 2026_08_15_real_destination_packages.sql with only a name and a price) into
-- a complete, publishable package.
--
-- Every detail below -- the pickup times, the hour-by-hour trek schedule, the
-- Day 2 stops, and the highlights -- comes from the operator's own itinerary.
-- Nothing here is inferred or invented. Fields the operator did not specify
-- (meals, exact homestay name, group size, difficulty grading) are left null
-- rather than guessed; fill them in via the admin panel when confirmed.
--
-- Safe to re-run: the package update is idempotent, and the itinerary insert
-- relies on the (package_id, day) unique constraint created below.
--
-- Run this in the Supabase SQL editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Ensure the itineraries table can be upserted by (package_id, day).
--    The table has no natural unique key by default, so `on conflict` below
--    would fail without this. Wrapped so re-running the file is harmless.
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
  title      = 'Bandaje Trek & Samse Exploration',
  location   = 'Bandaje & Samse, Karnataka',
  duration   = '2D / 1N',
  -- Two pickup points, with the operator's stated times.
  pickup     = 'Devagane (11:30 PM) / Shivamogga Bus Stand (2:40 AM)',
  category   = 'group',
  price      = 3899,
  overview   = 'An overnight drive into the Western Ghats, a full-day guided '
               'trek to the Bandaje waterfall viewpoint, and a second day '
               'winding through Samse -- tea estates, a hillside temple, and '
               'Soormane Falls -- before the drive home. One night in a local '
               'homestay, with a jeep leg to the trek base and back.',
  highlights = array[
    'Guided Bandaje Trek to the waterfall viewpoint',
    'Scenic jeep ride to and from the trek base',
    'Panoramic Western Ghats views from the peak',
    'Samse tea estate walk and photography stop',
    'Sri Ganapati Temple, Samse',
    'Soormane Falls',
    'Overnight homestay stay'
  ],
  transport  = 'Overnight coach from the pickup point, plus a jeep transfer to '
               'and from the trek base',
  accommodation = 'Homestay (1 night)',
  status     = 'published'
where slug = 'bandaje-falls-trek-3899';

-- ----------------------------------------------------------------------------
-- 3. The two-day itinerary, as supplied by the operator.
-- ----------------------------------------------------------------------------
insert into public.itineraries (package_id, day, title, description, stay_location)
values
  (
    (select id from public.packages where slug = 'bandaje-falls-trek-3899'), 1,
    'Bandaje Trek',
    'Pickup at 11:30 PM from Devagane and 2:40 AM from Shivamogga Bus Stand, '
    'travelling overnight towards the trek base. Arrive at the homestay '
    '6:30-7:00 AM to check in and settle. Freshen up over breakfast '
    '(7:00-8:00 AM), then prepare for the trek (8:00-8:30 AM) -- refill water, '
    'pack snacks and rain gear. A scenic jeep ride (8:30-9:00 AM) carries the '
    'group from the homestay to the trek base, and the Bandaje Trek begins at '
    '9:00 AM with an experienced local guide. Between 1:00 and 2:00 PM the '
    'group reaches the Bandaje peak and waterfall viewpoint for a packed lunch '
    'and the full Western Ghats panorama, then descends (2:00-4:30 PM) and '
    'takes the jeep back (4:30-5:00 PM). Tea and snacks at the homestay from '
    '5:00 PM, with the rest of the evening free.',
    'Homestay near the Bandaje trek base'
  ),
  (
    (select id from public.packages where slug = 'bandaje-falls-trek-3899'), 2,
    'Samse & Waterfall Exploration',
    'Breakfast at the homestay and check out. The morning takes in Sri '
    'Ganapati Temple in Samse, followed by a walk through the Samse tea '
    'estates -- lush plantation rows and a long photography stop. From there, '
    'on to Soormane Falls for time by the water and the surrounding forest. '
    'Sightseeing wraps in the evening, and the group proceeds to the drop-off '
    'point.',
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
--   from public.packages where slug = 'bandaje-falls-trek-3899';
--
-- select day, title, stay_location
--   from public.itineraries
--  where package_id = (select id from public.packages
--                       where slug = 'bandaje-falls-trek-3899')
--  order by day;
--
-- Still unconfirmed for this package -- add via the admin panel once known:
--   * meals (what's included across the two days)
--   * the homestay's name
--   * max group size
--   * difficulty grading for the trek
--   * a real photograph (currently sharing a stock Western Ghats image)
