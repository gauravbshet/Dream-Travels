-- ============================================================================
-- Dream Travels: packages RLS policies.
--
-- Symptom: the admin panel's "Save package" action (src/components/admin/
-- PackagesManager.tsx) intermittently fails with
--   "Failed to save package: Cannot coerce the result to a single JSON object"
-- (PostgREST error PGRST116). The save code does
--   .update(payload).eq("id", editingId).select("id")
--   .insert([payload]).select("id")
-- `id` is the primary key, so this can only ever touch 0 or 1 row -- never
-- "multiple". PGRST116 here means the write's own read-back
-- (`.select("id")`) came back with 0 rows, which happens when the INSERT/
-- UPDATE itself succeeds but the admin's session isn't allowed to SELECT
-- the row it just wrote -- classically because the only readable rows under
-- RLS are `status = 'published'` ones, and the package being saved is a
-- draft (or is being unpublished).
--
-- There is no earlier migration in this project that enables row-level
-- security or adds a policy for `packages` specifically (unlike `reels`,
-- `budget_tiers`, and `reviews`, which each got one -- see
-- 2026_08_10_add_reels_rls_policies.sql for the same class of bug on a
-- different table). This migration brings `packages` in line with every
-- other content table per SUPABASE_TABLES_AND_POLICIES.md section 2.4:
-- public read of published rows, full read/write for admins via the
-- existing public.is_admin() helper (2026_08_05b_fix_profiles_email_and_admin_read.sql).
--
-- Safe to run multiple times. Run this in Supabase Dashboard -> SQL Editor
-- -> New query -> Run.
--
-- Before running, you can confirm this is actually the gap with:
--   select rowsecurity from pg_tables where schemaname = 'public' and tablename = 'packages';
--   select policyname, cmd, qual, with_check from pg_policies where schemaname = 'public' and tablename = 'packages';
-- ============================================================================

alter table public.packages enable row level security;

-- Public/anonymous visitors and signed-in non-admin users can read published
-- packages -- this is what every public page already filters for itself
-- (src/app/packages/page.tsx, src/app/page.tsx, etc. all add
-- `.eq("status", "published")`), so this policy doesn't change what
-- visitors see; it just stops relying on the app remembering to filter.
drop policy if exists "Public read published packages" on public.packages;
create policy "Public read published packages" on public.packages
for select
using (status = 'published');

-- Admins can read and write every package regardless of status -- this is
-- the piece that was missing, and specifically fixes the admin save-package
-- flow: without it, an admin's own INSERT/UPDATE could write a draft row
-- but never be allowed to read it back in the same request.
drop policy if exists "Admins can manage all packages" on public.packages;
create policy "Admins can manage all packages" on public.packages
for all
using (public.is_admin())
with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select * from pg_policies where schemaname = 'public' and tablename = 'packages';
-- Then re-test saving a draft package (create one, and edit an existing one)
-- from the admin panel.
-- ----------------------------------------------------------------------------
