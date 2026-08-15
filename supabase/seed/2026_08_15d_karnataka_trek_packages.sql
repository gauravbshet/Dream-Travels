-- ============================================================================
-- Bandaje & Gangadikal trek packages -- 2D / 1N each
-- ============================================================================
-- Replaces 2026_08_15b and 2026_08_15c, which were wrong and have been
-- deleted. Those two files ran `update ... where slug = '...'` against draft
-- rows created by 2026_08_15_real_destination_packages.sql -- but that file
-- was never run against this database, so the rows never existed and the
-- updates would have matched nothing and silently done nothing.
--
-- The live database was populated through the admin panel instead, with its
-- own slugs. The destinations `bandaje` and `gangadikallu` already exist there
-- (with real uploaded photography); what is missing is the packages. So this
-- file INSERTs them and links to the destinations that actually exist.
--
-- Every itinerary detail comes from the operator: pickup times, the
-- hour-by-hour trek schedule, the Day 2 Samse stops, the highlights. Nothing
-- is inferred. Fields they did not specify (meals, homestay name, group size,
-- difficulty) are left null rather than guessed.
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
--    Images reuse each destination's own uploaded photograph, but inserted
--    through Cloudinary's `f_auto,q_auto` transform. The stored originals are
--    .heic, which Chrome and Firefox cannot render at all; f_auto makes
--    Cloudinary serve WebP instead and roughly halves the file size.
-- ----------------------------------------------------------------------------
insert into public.packages (
  destination_id, slug, title, location, image, category,
  duration, pickup, price, overview, status, highlights,
  transport, accommodation, dates, travel_type
)
values
  (
    (select id from public.destinations where slug = 'bandaje'),
    'bandaje-trek-samse-2d1n',
    'Bandaje Trek & Samse Exploration',
    'Bandaje & Samse, Karnataka',
    'https://res.cloudinary.com/q13dqswf/image/upload/f_auto,q_auto/v1786771654/dream-travels/hhmau81uyusbcdwwmh8v.heic',
    'group', '2D / 1N',
    'Devagane (11:30 PM) / Shivamogga Bus Stand (2:40 AM)',
    3899,
    'An overnight drive into the Western Ghats, a full-day guided trek to the '
    'Bandaje waterfall viewpoint, and a second day winding through Samse -- '
    'tea estates, a hillside temple, and Soormane Falls -- before the drive '
    'home. One night in a local homestay, with a jeep leg to the trek base '
    'and back.',
    'published',
    array[
      'Guided Bandaje Trek to the waterfall viewpoint',
      'Scenic jeep ride to and from the trek base',
      'Panoramic Western Ghats views from the peak',
      'Samse tea estate walk and photography stop',
      'Sri Ganapati Temple, Samse',
      'Soormane Falls',
      'Overnight homestay stay'
    ],
    'Overnight coach from the pickup point, plus a jeep transfer to and from '
    'the trek base',
    'Homestay (1 night)',
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
    'Devagane (11:30 PM) / Shivamogga Bus Stand (2:40 AM)',
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
  price          = excluded.price,
  overview       = excluded.overview,
  status         = excluded.status,
  highlights     = excluded.highlights,
  transport      = excluded.transport,
  accommodation  = excluded.accommodation,
  dates          = excluded.dates,
  travel_type    = excluded.travel_type;

-- ----------------------------------------------------------------------------
-- 3. Itineraries, as supplied by the operator.
-- ----------------------------------------------------------------------------
insert into public.itineraries (package_id, day, title, description, stay_location)
values
  -- Bandaje
  (
    (select id from public.packages where slug = 'bandaje-trek-samse-2d1n'), 1,
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
    (select id from public.packages where slug = 'bandaje-trek-samse-2d1n'), 2,
    'Samse & Waterfall Exploration',
    'Breakfast at the homestay and check out. The morning takes in Sri '
    'Ganapati Temple in Samse, followed by a walk through the Samse tea '
    'estates -- lush plantation rows and a long photography stop. From there, '
    'on to Soormane Falls for time by the water and the surrounding nature. '
    'Sightseeing wraps in the evening, and the group proceeds to the drop-off '
    'point.',
    null
  ),
  -- Gangadikal
  (
    (select id from public.packages where slug = 'gangadikal-trek-samse-2d1n'), 1,
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
    (select id from public.packages where slug = 'gangadikal-trek-samse-2d1n'), 2,
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
-- select slug, title, duration, price, status from public.packages
--  where slug in ('bandaje-trek-samse-2d1n', 'gangadikal-trek-samse-2d1n');
--
-- select p.slug, i.day, i.title from public.itineraries i
--   join public.packages p on p.id = i.package_id
--  where p.slug in ('bandaje-trek-samse-2d1n', 'gangadikal-trek-samse-2d1n')
--  order by p.slug, i.day;
--
-- Still unconfirmed -- add via the admin panel once known:
--   * meals included across the two days
--   * homestay name
--   * max group size
--   * difficulty grading
--
-- SEPARATE ISSUE worth fixing in the admin: the `bandaje` and `gangadikallu`
-- destination rows store their images as raw .heic URLs, which Chrome and
-- Firefox cannot display, so those photos are broken on the live site today.
-- Inserting `f_auto,q_auto/` into the Cloudinary path (as this file does for
-- the package images) makes Cloudinary serve WebP and fixes them.
