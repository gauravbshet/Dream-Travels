-- ============================================================================
-- Dream Travels: Budget Friendly tiers.
--
-- The homepage "Budget Friendly" section and the admin "Budget tiers" manager
-- (src/components/admin/BudgetTiersManager.tsx) both already assume a
-- `budget_tiers` table exists, but no migration ever created it -- so the
-- section always fell back to hardcoded static data and never reflected
-- admin edits or real package prices. This adds the table, RLS policies
-- (same pattern as `reels`, see 2026_08_09/2026_08_10), and seeds the
-- current default tiers so the section keeps working out of the box.
-- Safe to run multiple times.
-- ============================================================================

create table if not exists public.budget_tiers (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  emoji text not null,
  price_limit numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_budget_tiers_updated_at on public.budget_tiers;
create trigger set_budget_tiers_updated_at
  before update on public.budget_tiers
  for each row execute function public.set_updated_at();

create index if not exists idx_budget_tiers_price_limit on public.budget_tiers (price_limit);

alter table public.budget_tiers enable row level security;

drop policy if exists "Public read" on public.budget_tiers;
create policy "Public read" on public.budget_tiers
for select
using (true);

drop policy if exists "Admins can write budget tiers" on public.budget_tiers;
create policy "Admins can write budget tiers" on public.budget_tiers
for all
using (public.is_admin())
with check (public.is_admin());

-- Seed the default tiers, sized to the actual spread of package prices in
-- this app (roughly ₹2k - ₹35k) so the "verified packages" counts on the
-- homepage aren't all zero or all full on a fresh database.
insert into public.budget_tiers (title, emoji, price_limit)
select * from (
  values
    ('Under ₹5,000', '🏕', 5000),
    ('Under ₹10,000', '🚐', 10000),
    ('Under ₹20,000', '🏞', 20000),
    ('Premium Under ₹50,000', '✨', 50000)
) as seed(title, emoji, price_limit)
where not exists (select 1 from public.budget_tiers);

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select id, title, emoji, price_limit from public.budget_tiers order by price_limit;
-- ----------------------------------------------------------------------------
