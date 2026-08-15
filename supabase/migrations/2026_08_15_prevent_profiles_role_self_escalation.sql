-- ============================================================================
-- Dream Travels: prevent privilege escalation via profiles.role
--
-- Root cause: the "Users can manage their profile" policy checks row
-- ownership (auth.uid() = id) but does not restrict which columns a user
-- can write. Any authenticated user could set their own role to 'admin'
-- via a normal update/upsert call from the browser and gain full admin
-- dashboard access.
--
-- Fix: a trigger that silently reverts any change to `role` unless the
-- request is coming from an existing admin. This is defense-in-depth on
-- top of the existing RLS policy, not a replacement for it.
--
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

create or replace function public.enforce_profiles_role_default()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.role := 'user';
    end if;
  elsif tg_op = 'UPDATE' then
    if new.role is distinct from old.role and not public.is_admin() then
      new.role := old.role; -- silently revert any attempted self-promotion
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_profiles_role on public.profiles;
create trigger enforce_profiles_role
  before insert or update on public.profiles
  for each row execute function public.enforce_profiles_role_default();

-- ----------------------------------------------------------------------------
-- Verify: as a non-admin user, try updating your own role and confirm it
-- stays unchanged.
--   update public.profiles set role = 'admin' where id = auth.uid();
--   select role from public.profiles where id = auth.uid(); -- should still be 'user'
-- ----------------------------------------------------------------------------
