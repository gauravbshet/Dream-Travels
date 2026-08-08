-- ============================================================================
-- Dream Travels: reels RLS policies.
--
-- The `reels` table has row-level security enabled with no policies, which
-- blocks every insert/update/delete from the admin UI ("new row violates
-- row-level security policy for table reels"). Fix by granting public read
-- (same as every other content table -- see SUPABASE_TABLES_AND_POLICIES.md
-- section 2.4) and admin-only writes via the existing public.is_admin()
-- helper (see 2026_08_05b_fix_profiles_email_and_admin_read.sql). Safe to
-- run multiple times.
-- ============================================================================

alter table public.reels enable row level security;

drop policy if exists "Public read" on public.reels;
create policy "Public read" on public.reels
for select
using (true);

drop policy if exists "Admins can write reels" on public.reels;
create policy "Admins can write reels" on public.reels
for all
using (public.is_admin())
with check (public.is_admin());
