-- ============================================================================
-- Dream Travels: traveller reviews / testimonials.
--
-- src/app/page.tsx already queries `reviews` for the "Our Travellers'
-- Experiences" homepage carousel, and src/components/admin/ReviewsManager.tsx
-- already exists to manage them -- but no migration ever created the table,
-- so the homepage always silently fell back to the four hardcoded reviews in
-- src/data/reviews.ts. Adds the table (uuid pk, RLS: public read, admin
-- write) following the same shape/conventions as `reels`/`budget_tiers`.
-- `date` is stored as a free-text label (e.g. "2 weeks ago") to match what
-- ReviewsManager's form already collects. Safe to run multiple times.
-- ============================================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  avatar text,
  rating numeric not null default 5,
  review text not null,
  date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

create index if not exists idx_reviews_created_at on public.reviews (created_at);

alter table public.reviews enable row level security;

drop policy if exists "Public read" on public.reviews;
create policy "Public read" on public.reviews
for select
using (true);

drop policy if exists "Admins can write reviews" on public.reviews;
create policy "Admins can write reviews" on public.reviews
for all
using (public.is_admin())
with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select id, name, rating, date from public.reviews order by created_at desc;
-- ----------------------------------------------------------------------------
