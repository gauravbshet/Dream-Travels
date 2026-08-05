-- ============================================================================
-- Dream Travels: fix profiles.email (Customers tab 400 error) + admin read access
-- Safe to run multiple times.
--
-- Root cause: the admin Customers tab (src/components/admin/CustomersManager.tsx)
-- queries profiles.email, but profiles was only ever created with
-- id / role / full_name / phone / created_at -- email lives in auth.users.
-- Separately, the only RLS policy on profiles allows a user to read their own
-- row, so even after adding the column, an admin couldn't see other customers.
--
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Add the email column and backfill it from auth.users
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

-- ----------------------------------------------------------------------------
-- 2. Keep it in sync going forward: create/update the profile row whenever a
--    new auth user is created, and keep email fresh if it ever changes.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_update();

-- ----------------------------------------------------------------------------
-- 3. Admin helper + read policy, so the Customers tab can see every profile
--    (not just the signed-in admin's own row)
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles" on public.profiles
for select
using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Done. Verify with:
--   select id, email, full_name, phone, role, created_at from public.profiles;
-- (run as the Supabase SQL Editor / service role, which bypasses RLS)
-- ----------------------------------------------------------------------------
