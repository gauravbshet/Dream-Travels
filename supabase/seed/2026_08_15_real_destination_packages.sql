-- ============================================================================
-- Dream Travels: real destination and package content provided by the
-- business (Meghalaya/Assam, Kashmir, Manali, Arunachal Pradesh/Tawang,
-- Sikkim & Darjeeling, Nagaland).
--
-- Two fields were missing from the source content and are left NULL/marked
-- rather than invented — search for "NEEDS INPUT" below and fill in before
-- (or after) running this file:
--   1. Nagaland package price — every other package had a
--      "Bangalore to Bangalore" price, Nagaland's did not.
--   2. Manali duration — the source header said "3 Nights / 4 Days" but the
--      day-by-day list runs Day 1 to Day 6 (overnight bus out, return early
--      morning Day 6). This file uses 6D/5N to match the day-by-day detail;
--      correct the `duration` value below if the header was actually right
--      and the itinerary should be trimmed instead.
--
-- Manali already has a destination row (from the dummy seed file) with one
-- generic placeholder package. This file does NOT touch that destination
-- row or delete the placeholder package — it adds this real package
-- alongside it under the same destination. You may want to unpublish
-- (`update packages set status = 'draft'`) or delete the old
-- "manali-mountain-adventure-5d4n" dummy package once this real one is
-- live, so the site doesn't show both.
--
-- Prices corrected against a later business-provided list: Meghalaya
-- 48999 -> 47899, Kashmir 54999 -> 59999, Sikkim & Darjeeling
-- 44999 -> 36999 (destination and package rows both updated).
--
-- Section 4 adds six more real packages from that same list (Maharashtra,
-- Maharashtra Adventure, Gangadikallu, Bandaje Falls Trek, Kurinjal Peak,
-- Kedarnath) with their real names and prices, but NO day-by-day itinerary
-- — only a title and price were provided, no route, duration, pickup point,
-- or day plan, and inventing one would be fabricated content. They're
-- inserted with status = 'draft' so they exist in the admin dashboard for
-- editing but do NOT show on the public site until real details are added
-- and they're switched to 'published'.
--
-- IMPORTANT before publishing any of the six: packages/[slug]/page.tsx
-- currently falls back to a hardcoded fake 5-day "tea garden resort"
-- itinerary (DUMMY_ITINERARY) for ANY package with zero real itinerary
-- rows — including these. Publishing one of these six before it has a real
-- itinerary in the `itineraries` table would show that fake content to
-- customers. Flagging this now since it's directly relevant; happy to fix
-- the fallback (show an honest "itinerary coming soon" state instead) if
-- you'd like that done as a separate change.
--
-- Safe to run more than once -- every insert uses `on conflict (slug) do
-- nothing`, so re-running just skips rows that already exist.
--
-- Run in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Destinations (Manali already exists; the other five are new)
-- ----------------------------------------------------------------------------
insert into public.destinations (slug, name, description, cover_image, image, price, rating, is_featured)
values
  (
    'meghalaya',
    'Meghalaya',
    'Living root bridges, the wettest place on Earth, and Asia''s cleanest village -- waterfalls and misty hills across Shillong, Cherrapunji, and Dawki.',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    47899, null, false
  ),
  (
    'kashmir',
    'Kashmir',
    'Snow-capped Gulmarg, Mughal gardens in Srinagar, and a Shikara ride on Dal Lake -- winter in India''s most photographed valley.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    59999, null, false
  ),
  (
    'arunachal-pradesh',
    'Arunachal Pradesh',
    'Sela Pass, Tawang''s giant Buddha statue, and the Indo-China border at Bumla -- the Land of the Rising Sun in the Eastern Himalayas.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    49999, null, false
  ),
  (
    'sikkim',
    'Sikkim & Darjeeling',
    'Tsomgo Lake, the Indo-China border at Nathula Pass, and a sunrise over Kanchenjunga from Tiger Hill -- monasteries, tea gardens, and the UNESCO toy train.',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    36999, null, false
  ),
  (
    'nagaland',
    'Nagaland',
    'India''s first green village, the high-altitude Dzukou Valley trek, and Angami tribal heritage around Kohima.',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    null, null, false
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Packages (linked to the destinations above via slug lookup)
-- ----------------------------------------------------------------------------
insert into public.packages (
  destination_id, slug, title, location, image, category,
  duration, pickup, price, overview, status, highlights, transport, meals, accommodation
)
values
  (
    (select id from public.destinations where slug = 'meghalaya'),
    'meghalaya-assam-explorer-6d5n',
    'Meghalaya & Assam Explorer', 'Guwahati, Shillong, Cherrapunji, Dawki',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    'group', '6D / 5N', 'Guwahati Airport / Railway Station',
    47899,
    'From Kaziranga''s one-horned rhinos to the Double Decker Living Root Bridge and Asia''s cleanest village, Mawlynnong -- six days through Assam''s wildlife and Meghalaya''s waterfalls, caves, and living-root-bridge country.',
    'published',
    array[
      'Elephant and jeep safari in Kaziranga National Park',
      'Seven Sisters, Nohkalikai, and Rainbow Falls',
      'Trek to the Double Decker Living Root Bridge and Blue Lagoon',
      'Mawlynnong Village -- Asia''s Cleanest Village',
      'Boating on the crystal-clear Umngot River at Dawki'
    ],
    null, null, null
  ),
  (
    (select id from public.destinations where slug = 'kashmir'),
    'kashmir-winter-wonderland-7d6n',
    'Kashmir Winter Wonderland', 'Srinagar, Gulmarg, Pahalgam',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    'group', '7D / 6N', 'Srinagar Airport',
    59999,
    'A December-to-March winter circuit through Gulmarg''s snow slopes, Pahalgam''s valleys, and Srinagar''s Mughal gardens, ending with a Shikara ride on Dal Lake and a night on a deluxe houseboat.',
    'published',
    array[
      'Gulmarg snow activities and Gondola (optional)',
      'Mughal Gardens, Shankaracharya Temple, and Lal Chowk in Srinagar',
      'Aru Valley, Betaab Valley, and Chandanwari near Pahalgam',
      'Evening Shikara ride on Dal Lake',
      'Overnight stay on a Deluxe Houseboat'
    ],
    null, null, 'Deluxe houseboat (1 night), hotels (remaining nights)'
  ),
  (
    (select id from public.destinations where slug = 'manali'),
    'manali-himalayan-getaway-6d5n',
    'Manali Himalayan Getaway', 'Manali, Himachal Pradesh',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    'group', '6D / 5N', 'Kashmere Gate Volvo Bus Stand, Delhi',
    29999,
    'An overnight Volvo run from Delhi into Solang Valley adventure sports, the Atal Tunnel, Kasol and Manikaran''s hot springs, with river rafting and paragliding at Kullu along the way.',
    'published',
    array[
      'Hidimba Temple, Vashisht hot water spring, and Tibetan monastery',
      'Adventure activities in Solang Valley and the Atal Tunnel',
      'River rafting, paragliding, and hot air ballooning at Kullu',
      'Kasol and Manikaran natural hot spring',
      'Jogini Falls'
    ],
    'Volvo AC semi-sleeper, pickup/drop from Delhi', '3 breakfasts + 3 dinners', '3-star hotel in Manali'
  ),
  (
    (select id from public.destinations where slug = 'arunachal-pradesh'),
    'tawang-arunachal-explorer-7d6n',
    'Arunachal Pradesh -- Land of the Rising Sun', 'Guwahati, Bhalukpong, Dirang, Tawang, Bomdila',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    'group', '7D / 6N', 'Guwahati Airport / Railway Station',
    49999,
    'A Himalayan road journey from Guwahati through Bhalukpong and Dirang to Tawang, crossing Sela Pass to reach Bumla Pass on the Indo-China border, before looping back through Bomdila.',
    'published',
    array[
      'Sela Pass (13,700 ft) and Sela Lake',
      'Bumla Pass and the Indo-China border (permit and weather permitting)',
      'Sangetsar (Madhuri) Lake and PTSO Lake',
      'Tawang Monastery -- India''s largest monastery -- and the Giant Buddha Statue',
      'Nuranang (Jang) Waterfall and Bomdila Monastery'
    ],
    null, null, null
  ),
  (
    (select id from public.destinations where slug = 'sikkim'),
    'sikkim-darjeeling-himalayan-escape-6d5n',
    'Sikkim & Darjeeling -- The Himalayan Escape', 'Gangtok, Darjeeling',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    'group', '6D / 5N', 'NJP Railway Station / Bagdogra Airport',
    36999,
    'From Gangtok''s Tsomgo Lake and the Indo-China border at Nathula Pass to a Tiger Hill sunrise over Kanchenjunga and the UNESCO-listed Darjeeling toy train -- monasteries, tea gardens, and Himalayan views.',
    'published',
    array[
      'Tsomgo Lake (12,313 ft), Baba Harbhajan Singh Mandir, and Nathula Pass',
      'Sunrise over Kanchenjunga from Tiger Hill',
      'Darjeeling Himalayan Railway toy train joy ride (UNESCO heritage)',
      'Ghoom Monastery and the Himalayan Mountaineering Institute',
      'Tea garden visit and Batasia Loop'
    ],
    null, null, null
  ),
  (
    (select id from public.destinations where slug = 'nagaland'),
    'nagaland-explorer-5d4n',
    'Nagaland Explorer', 'Dimapur, Kohima, Khonoma, Dzukou Valley',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    'group', '5D / 4N', 'Dimapur Airport / Railway Station',
    null, -- NEEDS INPUT: no price was given for this package in the source content
    'Tribal heritage, terraced villages, and a high-altitude valley trek: Kohima''s war history, Khonoma -- India''s first green village -- and the Dzukou Valley, one of Northeast India''s most striking high-altitude valleys.',
    'published',
    array[
      'Kohima War Cemetery and Kisama Heritage Village',
      'Khonoma -- India''s first green village -- and its terraced paddy fields',
      'Trek through the Dzukou Valley''s rolling hills and seasonal wildflowers',
      'Traditional Naga cuisine (optional)',
      'Triple Falls and Kachari Ruins in Dimapur'
    ],
    null, null, null
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 3. Itineraries (day-by-day, linked to the packages above via slug lookup)
--
-- The itineraries table has no unique constraint beyond its primary key, so
-- a plain `on conflict do nothing` would never trigger and re-running this
-- file would duplicate every day row. Add one on (package_id, day) so the
-- insert below is actually idempotent.
-- ----------------------------------------------------------------------------
do $$
begin
  alter table public.itineraries add constraint itineraries_package_day_unique unique (package_id, day);
exception
  when duplicate_object then null;
end $$;

insert into public.itineraries (package_id, day, title, description, stay_location)
values
  -- Meghalaya & Assam Explorer
  (
    (select id from public.packages where slug = 'meghalaya-assam-explorer-6d5n'), 1,
    'Guwahati Arrival -- Kaziranga National Park',
    'Meet our representative at Guwahati Airport/Railway Station and drive to Kaziranga National Park (approx. 5-6 hours), a UNESCO World Heritage Site home to the endangered One-Horned Rhinoceros, wild elephants, swamp deer, Royal Bengal tigers, and over 500 bird species. Check in and evening at leisure.',
    'Kaziranga'
  ),
  (
    (select id from public.packages where slug = 'meghalaya-assam-explorer-6d5n'), 2,
    'Kaziranga Safari Experience -- Shillong',
    'Morning elephant safari (8:00 AM, subject to Forest Department availability) followed by a jeep safari through the National Park (10:00 AM). After breakfast, check out and drive to Shillong, the "Scotland of the East".',
    'Shillong'
  ),
  (
    (select id from public.packages where slug = 'meghalaya-assam-explorer-6d5n'), 3,
    'Shillong -- Cherrapunji Sightseeing',
    'Drive to Cherrapunji (Sohra), one of the wettest places on Earth, visiting Mawsmai Cave, Seven Sisters Waterfall, Nohkalikai Falls, Prut Falls, Lyngsiar Falls, and Arwah Cave en route and on arrival.',
    'Cherrapunji'
  ),
  (
    (select id from public.packages where slug = 'meghalaya-assam-explorer-6d5n'), 4,
    'Double Decker Living Root Bridge / Cherrapunji Exploration',
    'Choice of two experiences: an adventure trek to the Double Decker Living Root Bridge, Blue Lagoon, and Rainbow Falls, or a family-friendly tour of the Garden of Caves, Eco Park, and local waterfalls.',
    'Cherrapunji'
  ),
  (
    (select id from public.packages where slug = 'meghalaya-assam-explorer-6d5n'), 5,
    'Bamboo Trek -- Mawlynnong -- Dawki',
    'Traditional bamboo trek and suspension bridges, Mawlynnong Village (Asia''s Cleanest Village), and an optional stop at Sky View Point, before continuing to Shnongpdeng/Dawki and checking in to a riverside camp or homestay.',
    'Dawki / Shnongpdeng'
  ),
  (
    (select id from public.packages where slug = 'meghalaya-assam-explorer-6d5n'), 6,
    'Dawki Sightseeing -- Guwahati Drop',
    'Boating on the crystal-clear Umngot River, the Bangladesh border view point, Phe Phe Falls, and Krang Suri Falls, before the drive back to Guwahati Airport/Railway Station for onward travel.',
    null
  ),

  -- Kashmir Winter Wonderland
  (
    (select id from public.packages where slug = 'kashmir-winter-wonderland-7d6n'), 1,
    'Arrival Srinagar -- Gulmarg',
    'Airport pickup and drive to Gulmarg for snow activities and an optional Gondola ride.',
    'Gulmarg'
  ),
  (
    (select id from public.packages where slug = 'kashmir-winter-wonderland-7d6n'), 2,
    'Gulmarg -- Srinagar',
    'Return to Srinagar to visit the Mughal Gardens, Shankaracharya Temple, and Lal Chowk.',
    'Srinagar Hotel'
  ),
  (
    (select id from public.packages where slug = 'kashmir-winter-wonderland-7d6n'), 3,
    'Srinagar -- Pahalgam',
    'Drive to Pahalgam, visiting the Awantipora Ruins and saffron fields en route, with an evening at the Lidder River.',
    'Pahalgam'
  ),
  (
    (select id from public.packages where slug = 'kashmir-winter-wonderland-7d6n'), 4,
    'Pahalgam Sightseeing',
    'Aru Valley, Betaab Valley, and Chandanwari (subject to road conditions), with optional snow activities.',
    'Pahalgam'
  ),
  (
    (select id from public.packages where slug = 'kashmir-winter-wonderland-7d6n'), 5,
    'Pahalgam -- Doodhpathri -- Srinagar',
    'Visit Doodhpathri (subject to weather and road conditions) before returning to Srinagar.',
    'Srinagar Hotel'
  ),
  (
    (select id from public.packages where slug = 'kashmir-winter-wonderland-7d6n'), 6,
    'Srinagar',
    'Free day for shopping and local sightseeing, followed by an evening Shikara ride on Dal Lake and check-in to a Deluxe Houseboat.',
    'Deluxe Houseboat'
  ),
  (
    (select id from public.packages where slug = 'kashmir-winter-wonderland-7d6n'), 7,
    'Departure',
    'Breakfast, then transfer to Srinagar Airport.',
    null
  ),

  -- Manali Himalayan Getaway
  (
    (select id from public.packages where slug = 'manali-himalayan-getaway-6d5n'), 1,
    'Departure from Delhi',
    'Arrive at Kashmere Gate Volvo bus stand in the evening for the overnight journey to Manali.',
    null
  ),
  (
    (select id from public.packages where slug = 'manali-himalayan-getaway-6d5n'), 2,
    'Arrival in Manali -- Local Sightseeing',
    'Arrive in Manali around 7-8 AM and check in around 11 AM. After refreshments, visit Hidimba Temple, Vashisht hot water spring, the club house, and the Tibetan monastery, with an evening at Mall Road.',
    'Manali'
  ),
  (
    (select id from public.packages where slug = 'manali-himalayan-getaway-6d5n'), 3,
    'Jogini Falls -- Solang Valley -- Atal Tunnel',
    'Visit Jogini Falls, try adventure activities in Solang Valley, and see the Atal Tunnel and Sissu.',
    'Manali'
  ),
  (
    (select id from public.packages where slug = 'manali-himalayan-getaway-6d5n'), 4,
    'Kullu Adventure Day',
    'River rafting, paragliding, hot air ballooning, and more at Kullu.',
    'Manali'
  ),
  (
    (select id from public.packages where slug = 'manali-himalayan-getaway-6d5n'), 5,
    'Kasol & Manikaran',
    'Visit Kasol and Manikaran (natural hot spring), with an evening departure from Manali.',
    null
  ),
  (
    (select id from public.packages where slug = 'manali-himalayan-getaway-6d5n'), 6,
    'Arrival in Delhi',
    'Reach Delhi in the early morning, around 5-7 AM.',
    null
  ),

  -- Arunachal Pradesh / Tawang Explorer
  (
    (select id from public.packages where slug = 'tawang-arunachal-explorer-7d6n'), 1,
    'Gateway to Serenity: Guwahati -- Bhalukpong',
    'Meet our representative in Guwahati and drive to Bhalukpong (approx. 260 km, 6-7 hours), a riverside town at the foothills of the Eastern Himalayas and the entrance to Arunachal Pradesh, with views of the Kameng River.',
    'Bhalukpong'
  ),
  (
    (select id from public.packages where slug = 'tawang-arunachal-explorer-7d6n'), 2,
    'Nature''s Canvas: Bhalukpong -- Dirang',
    'Drive to Dirang (approx. 134 km, 5-6 hours), visiting the Orchid Garden, Lumum Waterfalls, Dirang Monastery, and Mandala Top (108 Buddhist stupas with panoramic Himalayan views).',
    'Dirang'
  ),
  (
    (select id from public.packages where slug = 'tawang-arunachal-explorer-7d6n'), 3,
    'Journey Through Paradise: Dirang -- Tawang',
    'Drive to Tawang (approx. 198 km, 7-8 hours) via Sangti Valley, the National Research Centre on Yak, Sela Pass (13,700 ft), Sela Lake, and the Jaswant Garh War Memorial.',
    'Tawang'
  ),
  (
    (select id from public.packages where slug = 'tawang-arunachal-explorer-7d6n'), 4,
    'Mystical Frontiers: Bumla Pass',
    'Full-day excursion to Bumla Pass near the Indo-China border, plus Sangetsar (Madhuri) Lake and PTSO Lake (subject to permit and weather conditions).',
    'Tawang'
  ),
  (
    (select id from public.packages where slug = 'tawang-arunachal-explorer-7d6n'), 5,
    'The Soul of Tawang',
    'Tawang Monastery (India''s largest monastery), the Giant Buddha Statue, the Tawang War Memorial, a light and sound show, and the local Tawang market.',
    'Tawang'
  ),
  (
    (select id from public.packages where slug = 'tawang-arunachal-explorer-7d6n'), 6,
    'The Scenic Retreat: Tawang -- Bomdila',
    'Drive to Bomdila (approx. 176 km, 6-7 hours), visiting Nuranang (Jang) Waterfall and Bomdila Monastery en route.',
    'Bomdila'
  ),
  (
    (select id from public.packages where slug = 'tawang-arunachal-explorer-7d6n'), 7,
    'Farewell to the Himalayas: Bomdila -- Guwahati',
    'Return drive to Guwahati (approx. 256 km, 7-8 hours) via Shergaon Village and the Bhutan view point, ending at Guwahati Airport/Railway Station.',
    null
  ),

  -- Sikkim & Darjeeling
  (
    (select id from public.packages where slug = 'sikkim-darjeeling-himalayan-escape-6d5n'), 1,
    'Welcome to the Capital of Sikkim: NJP/Bagdogra -- Gangtok',
    'Pickup from NJP Railway Station or Bagdogra Airport and a scenic drive to Gangtok along the Teesta River, with the evening free at MG Marg.',
    'Gangtok'
  ),
  (
    (select id from public.packages where slug = 'sikkim-darjeeling-himalayan-escape-6d5n'), 2,
    'Journey to the Indo-China Border',
    'Visit Tsomgo Lake (12,313 ft), Baba Harbhajan Singh Mandir, and Nathula Pass on the Indo-China border (subject to permit and weather), returning to Gangtok by evening.',
    'Gangtok'
  ),
  (
    (select id from public.packages where slug = 'sikkim-darjeeling-himalayan-escape-6d5n'), 3,
    'Gangtok to Darjeeling',
    'Morning sightseeing at Banjhakri Waterfall, the Namgyal Institute of Tibetology, and the Flower Exhibition Centre, then drive to Darjeeling.',
    'Darjeeling'
  ),
  (
    (select id from public.packages where slug = 'sikkim-darjeeling-himalayan-escape-6d5n'), 4,
    'Sunrise Over Kanchenjunga',
    'Tiger Hill sunrise, the Batasia Loop, Ghoom Monastery, the Padmaja Naidu Himalayan Zoo, the Himalayan Mountaineering Institute, a tea garden visit, and an optional ropeway ride.',
    'Darjeeling'
  ),
  (
    (select id from public.packages where slug = 'sikkim-darjeeling-himalayan-escape-6d5n'), 5,
    'UNESCO Heritage Toy Train',
    'Darjeeling Toy Train joy ride, Ghoom Railway Station, and local market exploration.',
    'Darjeeling'
  ),
  (
    (select id from public.packages where slug = 'sikkim-darjeeling-himalayan-escape-6d5n'), 6,
    'Farewell Himalayas: Darjeeling -- NJP/Bagdogra',
    'Check out and transfer to NJP Railway Station or Bagdogra Airport.',
    null
  ),

  -- Nagaland Explorer
  (
    (select id from public.packages where slug = 'nagaland-explorer-5d4n'), 1,
    'Welcome to Nagaland: Arrival in Dimapur',
    'Pickup at Dimapur Airport/Railway Station, then visit Triple Falls, Kachari Ruins, and the Dimapur local market, with traditional Naga cuisine optional.',
    'Dimapur'
  ),
  (
    (select id from public.packages where slug = 'nagaland-explorer-5d4n'), 2,
    'Capital of Nagaland: Dimapur -- Kohima',
    'Drive to Kohima (approx. 75 km, 3 hours) and visit the Kohima War Cemetery, the Nagaland State Museum, and Kisama Heritage Village (the Hornbill Festival venue).',
    'Kohima'
  ),
  (
    (select id from public.packages where slug = 'nagaland-explorer-5d4n'), 3,
    'Khonoma -- India''s First Green Village',
    'Excursion to Khonoma Village, home to the Angami tribe, with traditional Angami houses, terraced paddy fields, and a guided heritage village walk.',
    'Kohima'
  ),
  (
    (select id from public.packages where slug = 'nagaland-explorer-5d4n'), 4,
    'Adventure to Dzukou Valley',
    'Trek through the Dzukou Valley, one of Northeast India''s most striking high-altitude valleys, with rolling green hills and seasonal wildflowers. Optional camping.',
    'Kohima / Dzukou Campsite (optional)'
  ),
  (
    (select id from public.packages where slug = 'nagaland-explorer-5d4n'), 5,
    'Farewell Nagaland: Kohima -- Dimapur',
    'Scenic drive back to Dimapur, with time for last-minute shopping before the airport/railway station drop.',
    null
  )
on conflict (package_id, day) do nothing;

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select p.title, p.slug, d.name as destination, p.price, p.status
--   from public.packages p
--   left join public.destinations d on d.id = p.destination_id
--   where p.slug in (
--     'meghalaya-assam-explorer-6d5n', 'kashmir-winter-wonderland-7d6n',
--     'manali-himalayan-getaway-6d5n', 'tawang-arunachal-explorer-7d6n',
--     'sikkim-darjeeling-himalayan-escape-6d5n', 'nagaland-explorer-5d4n'
--   )
--   order by p.created_at desc;
--
--   select package_id, count(*) as day_count
--   from public.itineraries
--   group by package_id;
-- ----------------------------------------------------------------------------

-- ============================================================================
-- 4. Six more real packages -- names and prices only, no itinerary
--
-- See the note at the top of this file: no route, duration, pickup point,
-- or day plan was provided for any of these, so none is invented here.
-- Inserted as status = 'draft' -- visible in the admin dashboard for
-- editing, hidden from the public site until switched to 'published' with
-- real details filled in.
-- ============================================================================

insert into public.destinations (slug, name, description, cover_image, image, price, rating, is_featured)
values
  (
    'maharashtra',
    'Maharashtra',
    null,
    'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=1200&q=80',
    null, null, false
  ),
  (
    'karnataka-western-ghats-treks',
    'Karnataka Western Ghats Treks',
    null,
    'https://images.unsplash.com/photo-1580289142438-6470c4bab0e5?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1580289142438-6470c4bab0e5?auto=format&fit=crop&w=1200&q=80',
    null, null, false
  ),
  (
    'kedarnath',
    'Kedarnath',
    null,
    'https://images.unsplash.com/photo-1626016207565-1e42345e0710?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1626016207565-1e42345e0710?auto=format&fit=crop&w=1200&q=80',
    null, null, false
  )
on conflict (slug) do nothing;

insert into public.packages (
  destination_id, slug, title, location, image, category, price, status
)
values
  (
    (select id from public.destinations where slug = 'maharashtra'),
    'maharashtra-7999',
    'Maharashtra', 'Maharashtra',
    'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=1200&q=80',
    'group', 7999, 'draft'
  ),
  (
    (select id from public.destinations where slug = 'karnataka-western-ghats-treks'),
    'gangadikallu-3899',
    'Gangadikallu', 'Karnataka',
    'https://images.unsplash.com/photo-1580289142438-6470c4bab0e5?auto=format&fit=crop&w=1200&q=80',
    'group', 3899, 'draft'
  ),
  (
    (select id from public.destinations where slug = 'karnataka-western-ghats-treks'),
    'bandaje-falls-trek-3899',
    'Bandaje Falls Trek', 'Karnataka',
    'https://images.unsplash.com/photo-1580289142438-6470c4bab0e5?auto=format&fit=crop&w=1200&q=80',
    'group', 3899, 'draft'
  ),
  (
    (select id from public.destinations where slug = 'karnataka-western-ghats-treks'),
    'kurinjal-peak-3899',
    'Kurinjal Peak', 'Karnataka',
    'https://images.unsplash.com/photo-1580289142438-6470c4bab0e5?auto=format&fit=crop&w=1200&q=80',
    'group', 3899, 'draft'
  ),
  (
    (select id from public.destinations where slug = 'maharashtra'),
    'maharashtra-adventure-8999',
    'Maharashtra Adventure', 'Maharashtra',
    'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=1200&q=80',
    'group', 8999, 'draft'
  ),
  (
    (select id from public.destinations where slug = 'kedarnath'),
    'kedarnath-29999',
    'Kedarnath', 'Uttarakhand',
    'https://images.unsplash.com/photo-1626016207565-1e42345e0710?auto=format&fit=crop&w=1200&q=80',
    'group', 29999, 'draft'
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Once real itinerary/route details are available for these six, fill in
-- duration/pickup/overview, add day rows to `itineraries` (see section 3
-- above for the pattern), then:
--   update public.packages set status = 'published' where slug in (
--     'maharashtra-7999', 'gangadikallu-3899', 'bandaje-falls-trek-3899',
--     'kurinjal-peak-3899', 'maharashtra-adventure-8999', 'kedarnath-29999'
--   );
-- ----------------------------------------------------------------------------
