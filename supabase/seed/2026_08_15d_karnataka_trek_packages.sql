-- ============================================================================
-- Bandaje & Gangadikal trek packages -- 2D / 1N each
-- ============================================================================
-- This file has not yet been run against the live database, so it is edited
-- in place rather than layered with follow-up migrations. Two corrections
-- since the first draft, both confirmed by the business:
--
--   1. Bandaje's day 2 is LOCAL SIGHTSEEING (nearby waterfalls, coffee and
--      areca estates, viewpoints, a temple), not the Samse route. Day 1 also
--      gains a campfire and dinner. The trip is positioned as a monsoon
--      adventure. The slug changed from `bandaje-trek-samse-2d1n` to
--      `bandaje-waterfalls-monsoon-2d1n` to match. Gangadikal keeps the Samse
--      day -- that route belongs to it, not to Bandaje.
--
--   2. The pickup town is Davanagere, not "Devagane" -- corrected on both
--      packages.
--
-- Pickup and drop times carry over from the operator's earlier note for these
-- trips (Davanagere 11:30 PM, Shivamogga 2:40 AM), which matches this
-- itinerary's 6:30-7:00 AM arrival after an overnight drive.
--
-- Destinations `bandaje` and `gangadikallu` already exist in the live database
-- (created through the admin panel, with real uploaded photography). This file
-- inserts the packages and links to them. Nothing here is inferred from
-- outside the operator's own itineraries.
--
-- Safe to re-run: both inserts upsert on their unique key.
-- Run this in the Supabase SQL editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Let itinerary day rows be upserted by (package_id, day).
--    The table has no natural unique key by default.
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
-- 2. The two packages.
--
--    Images reuse each destination's own uploaded photograph, but through
--    Cloudinary's `f_auto,q_auto` transform. The stored originals are .heic,
--    which Chrome and Firefox cannot render at all; f_auto serves WebP
--    instead and roughly halves the file size.
-- ----------------------------------------------------------------------------
insert into public.packages (
  destination_id, slug, title, location, image, category,
  duration, pickup, drop_point, price, overview, status, highlights,
  transport, accommodation, meals, best_time, dates, travel_type
)
values
  (
    (select id from public.destinations where slug = 'bandaje'),
    'bandaje-waterfalls-monsoon-2d1n',
    'Bandaje Waterfalls Monsoon Adventure',
    'Bandaje, Karnataka',
    'https://res.cloudinary.com/q13dqswf/image/upload/f_auto,q_auto/v1786771654/dream-travels/hhmau81uyusbcdwwmh8v.heic',
    'group', '2D / 1N',
    'Davanagere (11:30 PM) / Shivamogga Bus Stand (2:40 AM)',
    'Shivamogga / Davanagere',
    3899,
    'A monsoon trek to the Bandaje waterfalls -- lush green forest, stream '
    'crossings and rain-soaked trails, with a local guide. Evening campfire '
    'and dinner at the homestay, then a second day of local sightseeing '
    'around nearby waterfalls, coffee and areca estates, viewpoints and a '
    'village temple before the return journey.',
    'published',
    array[
      'Guided Bandaje Waterfalls monsoon trek',
      'Trek through lush forest, streams and monsoon trails',
      'Scenic jeep ride to and from the trek base',
      'Packed lunch at the waterfall viewpoint',
      'Evening campfire, subject to weather',
      'Overnight homestay stay with dinner',
      'Day 2 local sightseeing -- waterfalls, estates and viewpoints',
      'Coffee and areca estate walk',
      'Nearby temple visit'
    ],
    'Overnight coach from the pickup point, plus a jeep transfer to and from '
    'the trek base',
    'Homestay (1 night)',
    'Day 1 breakfast, packed lunch, evening tea and snacks, and dinner. Day 2 '
    'breakfast. Day 2 lunch is self-sponsored.',
    'Monsoon season',
    'Available year-round',
    'Group'
  ),
  (
    (select id from public.destinations where slug = 'gangadikallu'),
    'gangadikal-trek-samse-2d1n',
    'Gangadikal Trek & Samse Exploration',
    'Gangadikal & Samse, Karnataka',
    'https://res.cloudinary.com/q13dqswf/image/upload/f_auto,q_auto/v1786771526/dream-travels/qyq1z5ncjc9kgwdofnpu.heic',
    'group', '2D / 1N',
    'Davanagere (11:30 PM) / Shivamogga Bus Stand (2:40 AM)',
    null,
    3899,
    'An overnight drive into the Western Ghats, a full day on the Gangadikal '
    'trail with a local guide, and a second day through Samse -- tea '
    'plantations, a hillside temple, and Soormane Falls -- before the drive '
    'home. One night in a homestay, with a jeep leg to the trek base and back.',
    'published',
    array[
      'Guided Gangadikal Trek to the peak',
      'Scenic jeep ride to and from the trek base',
      'Panoramic Western Ghats views from the summit',
      'Samse tea estate walk and photography stop',
      'Sri Ganapati Temple, Samse',
      'Soormane Falls',
      'Overnight homestay stay',
      'Nature and adventure experience'
    ],
    'Overnight coach from the pickup point, plus a jeep transfer to and from '
    'the trek base',
    'Homestay (1 night)',
    null,
    null,
    'Available year-round',
    'Group'
  )
on conflict (slug) do update
set
  destination_id = excluded.destination_id,
  title          = excluded.title,
  location       = excluded.location,
  image          = excluded.image,
  category       = excluded.category,
  duration       = excluded.duration,
  pickup         = excluded.pickup,
  drop_point     = excluded.drop_point,
  price          = excluded.price,
  overview       = excluded.overview,
  status         = excluded.status,
  highlights     = excluded.highlights,
  transport      = excluded.transport,
  accommodation  = excluded.accommodation,
  meals          = excluded.meals,
  best_time      = excluded.best_time,
  dates          = excluded.dates,
  travel_type    = excluded.travel_type;

-- ----------------------------------------------------------------------------
-- 3. Itineraries, as supplied by the operator.
-- ----------------------------------------------------------------------------
insert into public.itineraries
  (package_id, day, title, description, stay_location, meals, optional_note)
values
  -- Bandaje Waterfalls Monsoon Adventure
  (
    (select id from public.packages where slug = 'bandaje-waterfalls-monsoon-2d1n'), 1,
    'Bandaje Waterfalls Trek',
    'Arrive at the homestay 6:30-7:00 AM after the overnight drive, check in '
    'and settle. Freshen up over breakfast (7:00-8:00 AM), then prepare for '
    'the trek (8:00-8:30 AM) -- water and snacks, rain gear, trekking '
    'essentials. A scenic jeep ride (8:30-9:00 AM) carries the group to the '
    'trek base, and the Bandaje Waterfalls trek begins at 9:00 AM with a '
    'local guide, following streams and monsoon trails through lush green '
    'forest. Between 1:00 and 2:00 PM the group reaches the waterfall '
    'viewpoint for a packed lunch, photography and time at leisure, then '
    'treks back down (2:00-4:30 PM) and takes the jeep to the homestay '
    '(4:30-5:00 PM). Freshen up over tea and snacks from 5:00 to 6:00 PM. '
    'Campfire in the evening, weather permitting, followed by dinner and an '
    'overnight stay at the homestay.',
    'Homestay near the Bandaje trek base',
    'Breakfast, packed lunch, evening tea and snacks, dinner',
    'The evening campfire is subject to weather conditions.'
  ),
  (
    (select id from public.packages where slug = 'bandaje-waterfalls-monsoon-2d1n'), 2,
    'Local Sightseeing',
    'Wake up and freshen up from 7:00 AM, with breakfast at the homestay at '
    '8:00 AM. Local sightseeing runs from 9:00 AM onwards: nearby waterfalls, '
    'coffee and areca estates, scenic viewpoints and village landscapes, and '
    'a nearby temple, with time for photography and leisure throughout. Lunch '
    'is self-sponsored. The return journey begins in the afternoon, with '
    'drop-off at Shivamogga or Davanagere.',
    null,
    'Breakfast. Lunch is self-sponsored.',
    'Trek timings and sightseeing may change depending on rainfall, road '
    'conditions, forest restrictions and local weather.'
  ),
  -- Gangadikal Trek & Samse Exploration
  (
    (select id from public.packages where slug = 'gangadikal-trek-samse-2d1n'), 1,
    'Gangadikal Trek',
    'Pickup at 11:30 PM from Davanagere and 2:40 AM from Shivamogga Bus '
    'Stand, travelling overnight towards the trek destination. Arrive at the '
    'homestay 6:30-7:00 AM to check in and freshen up, then breakfast from '
    '7:00 to 8:00 AM. Trek preparation follows (8:00-8:30 AM) -- refill water '
    'bottles, pack snacks, rain gear and essentials. A scenic jeep ride '
    '(8:30-9:00 AM) carries the group from the homestay to the trek base, and '
    'the Gangadikal Trek begins at 9:00 AM with an experienced local guide. '
    'Between 1:00 and 2:00 PM the group reaches Gangadikal Peak for a packed '
    'lunch and breathtaking panoramic views across the Western Ghats, then '
    'descends (2:00-4:30 PM) and takes the jeep back (4:30-5:00 PM). Evening '
    'tea and snacks from 5:00 PM, with the rest of the evening free at the '
    'homestay.',
    'Homestay near the Gangadikal trek base',
    null,
    null
  ),
  (
    (select id from public.packages where slug = 'gangadikal-trek-samse-2d1n'), 2,
    'Samse & Waterfall Exploration',
    'Breakfast at the homestay and check out. The morning takes in Sri '
    'Ganapati Temple in Samse -- a serene stop in beautiful surroundings -- '
    'followed by a walk through the lush Samse tea plantations, with scenic '
    'views worth the photography stop. From there, on to Soormane Falls for '
    'time around the water and the surrounding nature. Sightseeing wraps in '
    'the evening, and the group proceeds to the designated drop-off point.',
    null,
    null,
    null
  )
on conflict (package_id, day) do update
set
  title         = excluded.title,
  description   = excluded.description,
  stay_location = excluded.stay_location,
  meals         = excluded.meals,
  optional_note = excluded.optional_note;

-- ----------------------------------------------------------------------------
-- 4. Verify.
-- ----------------------------------------------------------------------------
-- select slug, title, duration, pickup, price, status from public.packages
--  where slug in ('bandaje-waterfalls-monsoon-2d1n',
--                 'gangadikal-trek-samse-2d1n');
--
-- select p.slug, i.day, i.title from public.itineraries i
--   join public.packages p on p.id = i.package_id
--  where p.slug in ('bandaje-waterfalls-monsoon-2d1n',
--                   'gangadikal-trek-samse-2d1n')
--  order by p.slug, i.day;
--
-- Still unconfirmed -- add via the admin panel once known:
--   * homestay name
--   * max group size
--   * difficulty grading
--   * meals for Gangadikal (Bandaje's are specified; Gangadikal's are not)
--
-- SEPARATE ISSUE worth fixing in the admin: the `bandaje` and `gangadikallu`
-- destination rows store their images as raw .heic URLs, which Chrome and
-- Firefox cannot display, so those photos are broken on the live site today.
-- Inserting `f_auto,q_auto/` into the Cloudinary path (as this file does for
-- the package images) makes Cloudinary serve WebP and fixes them.
