-- ============================================================================
-- Dream Travels: dummy seed data matching the current live schema
-- (destinations: id, slug, name, description, cover_image, image, price,
--  rating, is_featured, created_at, updated_at)
-- (packages: id, destination_id, slug, title, location, image, category,
--  duration, pickup, dates, price, original_price, overview, additional_images,
--  rating, reviews, is_top_pick, created_at, updated_at)
--
-- Safe to run more than once -- every insert uses `on conflict (slug) do
-- nothing`, so re-running just skips rows that already exist.
--
-- Run in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Destinations
-- ----------------------------------------------------------------------------
insert into public.destinations (slug, name, description, cover_image, image, price, rating, is_featured)
values
  ('goa', 'Goa', 'Sun-soaked beaches, Portuguese-era lanes, and a nightlife that never sleeps.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 9999, 4.6, true),
  ('munnar', 'Munnar', 'Rolling tea estates, misty hills, and cool mountain air in Kerala''s Western Ghats.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80', 12999, 4.7, true),
  ('coorg', 'Coorg', 'Coffee plantations, waterfalls, and the Scotland of India.', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', 13999, 4.7, false),
  ('wayanad', 'Wayanad', 'Wildlife sanctuaries, caves, and lush green valleys in Kerala.', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', 11999, 4.6, false),
  ('manali', 'Manali', 'Snow-capped peaks, riverside camps, and Himalayan adventure.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', 15999, 4.8, true),
  ('andaman', 'Andaman', 'Turquoise lagoons, coral reefs, and untouched island beaches.', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80', 28999, 4.9, true)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Packages (linked to the destinations above via slug lookup)
-- ----------------------------------------------------------------------------
insert into public.packages (
  destination_id, slug, title, location, image, additional_images, category,
  duration, pickup, dates, price, original_price, rating, reviews, overview,
  is_top_pick
)
values
  (
    (select id from public.destinations where slug = 'goa'),
    'goa-beach-bliss-4d3n',
    'Goa Beach Bliss', 'North & South Goa',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    'group', '4D / 3N', 'Goa Airport (GOI) pickup included', 'Available year-round',
    9999, 12999, 4.6, 214,
    'Four days of beach-hopping between Baga, Anjuna, and Palolem, with a sunset cruise and a night out in Tito''s Lane.',
    true
  ),
  (
    (select id from public.destinations where slug = 'munnar'),
    'munnar-tea-trails-5d4n',
    'Munnar Tea Trails', 'Munnar, Kerala',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80'
    ],
    'family', '5D / 4N', 'Cochin Airport (COK) pickup included', 'Best Sep-Mar',
    12999, 15999, 4.7, 189,
    'Wake up to tea-estate views, walk through spice plantations, and catch the mist roll over Eravikulam National Park.',
    true
  ),
  (
    (select id from public.destinations where slug = 'coorg'),
    'coorg-coffee-country-4d3n',
    'Coorg Coffee Country', 'Madikeri, Coorg',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
    ],
    'family', '4D / 3N', 'Bangalore pickup available', 'Available year-round',
    13999, null, 4.7, 132,
    'Coffee estate walks, Abbey Falls, and a homestay evening with Kodava cuisine.',
    false
  ),
  (
    (select id from public.destinations where slug = 'wayanad'),
    'wayanad-wild-escape-3d2n',
    'Wayanad Wild Escape', 'Wayanad, Kerala',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
    ],
    'solo', '3D / 2N', 'Kozhikode Airport (CCJ) pickup included', 'Best Oct-May',
    11999, 13999, 4.6, 97,
    'Edakkal Caves, a wildlife safari, and a sunset at Chembra Peak.',
    false
  ),
  (
    (select id from public.destinations where slug = 'manali'),
    'manali-mountain-adventure-5d4n',
    'Manali Mountain Adventure', 'Manali, Himachal Pradesh',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'
    ],
    'group', '5D / 4N', 'Bhuntar Airport (KUU) pickup included', 'Best Mar-Jun, Oct-Feb',
    15999, 18999, 4.8, 276,
    'Solang Valley, Rohtang Pass (season permitting), and a riverside camping night with bonfire and local music.',
    true
  ),
  (
    (select id from public.destinations where slug = 'andaman'),
    'andaman-island-escape-6d5n',
    'Andaman Island Escape', 'Port Blair & Havelock Island',
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80',
    array[
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80'
    ],
    'international', '6D / 5N', 'Veer Savarkar Airport (IXZ) pickup included', 'Best Oct-May',
    28999, 34999, 4.9, 158,
    'Radhanagar Beach, scuba diving at Havelock, and a light-and-sound show at Cellular Jail.',
    true
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select p.title, p.slug, d.name as destination, p.price, p.is_top_pick
--   from public.packages p
--   left join public.destinations d on d.id = p.destination_id
--   order by p.created_at desc;
-- ----------------------------------------------------------------------------
