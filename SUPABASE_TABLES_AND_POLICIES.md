# Supabase Setup for Dream Travels

This document describes the Supabase database schema, storage setup, and security policies that match the current Dream Travels app.

## 0. Required Supabase configuration

In your `.env` file, set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (optional for Open Graph and schema metadata)

The app uses Supabase Auth for:
- email/password sign in and sign up
- social login providers through Supabase Auth

The browser client is created in `src/lib/supabase.client.ts`.

## 1. Tables and expected columns

### 1.1 `profiles`
Stores user metadata and role information.

Columns:
- `id uuid` primary key references `auth.users.id`
- `role text` (e.g. `user`, `admin`)
- `full_name text`
- `phone text`
- `email text`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/components/layout/Navbar.tsx` for role-based admin link display
- `src/app/admin/page.tsx` to verify admin access
- `src/components/admin/CustomersManager.tsx` to load customer profiles
- `src/app/login/page.tsx` to create/update the profile on sign up

As of 2026-08-05, `email` is populated automatically by a database trigger
(`on_auth_user_created` / `handle_new_user`) that copies it from `auth.users`
whenever a user signs up, and kept in sync on email changes via
`on_auth_user_email_updated`. An `is_admin()` helper plus an "Admins can read
all profiles" policy was added so the admin Customers tab can see every
profile, not just the signed-in admin's own row. See
`supabase/migrations/2026_08_05b_fix_profiles_email_and_admin_read.sql`.

### 1.2 `wishlists`
Stores user-specific saved package rows.

Columns:
- `id uuid` primary key
- `user_id uuid` references `profiles.id` or `auth.users.id`
- `package_id uuid` references `packages.id`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/dashboard/page.tsx`
- `src/components/admin/CustomersManager.tsx`

### 1.3 `destinations`
Public travel destination content.

Columns:
- `id uuid` primary key
- `slug text` unique
- `name text`
- `description text`
- `cover_image text`
- `image text`
- `price numeric`
- `rating numeric`
- `is_featured boolean` default `false`
- `created_at timestamp with time zone` default `now()`
- `updated_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`
- `src/app/destinations/[slug]/page.tsx`
- `src/components/admin/DestinationsManager.tsx`
- `src/components/admin/PackagesManager.tsx` (destination dropdown)

Note: prior to 2026-08-05, `DestinationsManager.tsx` was mistakenly reading
and writing a different, incompatible column set (`title`, `country`,
`categories`, `photo_url`) that did not match the columns above, which the
public pages and the packages admin dropdown have always relied on. This has
been fixed so all admin and public code now agree on the schema documented
here. If your live table still has the old columns, run
`supabase/migrations/2026_08_05_fix_destinations_packages_schema.sql`, which
backfills `name`/`image`/`cover_image` from the legacy columns before you drop
them.

### 1.4 `packages`
Public package listing data.

Columns:
- `id uuid` primary key
- `slug text` unique
- `title text`
- `location text`
- `image text`
- `additional_images text[]`
- `category text`
- `duration text`
- `pickup text`
- `dates text`
- `rating numeric`
- `reviews int`
- `price numeric`
- `original_price numeric`
- `overview text`
- `destination_id uuid` references `destinations.id`
- `is_top_pick boolean` default `false`
- `created_at timestamp with time zone` default `now()`
- `updated_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`
- `src/app/packages/[slug]/page.tsx`
- `src/app/destinations/[slug]/page.tsx`
- `src/components/admin/PackagesManager.tsx`

As of 2026-08-05, `location`, `category`, `pickup`, `dates`, `original_price`,
`rating`, `reviews`, `is_top_pick`, and `slug` are fully editable from the
admin Packages form (previously only title/destination/duration/price/overview
were exposed, even though the public pages already read the rest). See
`supabase/migrations/2026_08_05_fix_destinations_packages_schema.sql` for the
migration that adds any of these columns if your live table predates them.

### 1.5 `itineraries`
Package itinerary details.

Columns:
- `id uuid` primary key
- `package_id uuid` references `packages.id`
- `day int`
- `title text`
- `description text`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/packages/[slug]/page.tsx`
- `src/components/admin/ItinerariesManager.tsx`

### 1.6 `reviews`
Public reviews data shown on the home page.

Columns:
- `id uuid` primary key
- `name text`
- `avatar text`
- `rating int`
- `review text`
- `date text`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`

### 1.7 `blogs`
Travel blog cards for the homepage.

Columns:
- `id uuid` primary key
- `title text`
- `category text`
- `image text`
- `read_time text`
- `author text`
- `date text`
- `excerpt text`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`

### 1.8 `events`
Public event listings.

Columns:
- `id uuid` primary key
- `title text`
- `image text`
- `date text`
- `location text`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`

### 1.9 `popular_experiences`
Public experience tiles.

Columns:
- `id uuid` primary key
- `title text`
- `image text`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`

### 1.10 `seasonal_collections`
Seasonal collection tiles.

Columns:
- `id uuid` primary key
- `title text`
- `image text`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`

### 1.11 `budget_tiers`
Budget tier entries used for the home page filters.

Columns:
- `id uuid` primary key
- `title text`
- `emoji text`
- `price_limit numeric`
- `created_at timestamp with time zone` default `now()`

Used by:
- `src/app/page.tsx`

### 1.12 Storage bucket: `images`
Used by admin uploads for destination and package images.

Bucket settings:
- Bucket name: `images`
- Public access: yes (the app calls `getPublicUrl`)
- `cacheControl`: 3600 in upload code

The upload flow in admin components:
- `src/components/admin/DestinationsManager.tsx`
- `src/components/admin/PackagesManager.tsx`

Those components upload to `storage.from("images")` and then call `.getPublicUrl(data.path)`.

## 1.13 Admin helper function for RLS checks

To avoid recursive policy lookups and RLS recursion, define a helper function that checks admin status while bypassing RLS.

```sql
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
```

This function should be used by policy definitions instead of nested `select` checks against `profiles`.

## 2. Recommended RLS policies

### 2.1 Enable RLS on all database tables
Turn on row-level security for each table, then add policies for public reads and auth-protected writes.

### 2.2 `profiles`
- `SELECT`: `auth.uid() = id`
- `INSERT`: `auth.uid() = id`
- `UPDATE`: `auth.uid() = id`
- `DELETE`: restrict to admin only

Example policy:
```sql
create policy "Users can manage their profile" on profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);
```

### 2.3 `wishlists`
- `SELECT`: `auth.uid() = user_id`
- `INSERT`: `auth.uid() = user_id`
- `DELETE`: `auth.uid() = user_id`

Example policy:
```sql
create policy "Users can manage own wishlist" on wishlists
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

### 2.4 Public content tables
For these tables, allow public reads and restrict writes to admins:
- `destinations`
- `packages`
- `itineraries`
- `reviews`
- `blogs`
- `events`
- `popular_experiences`
- `seasonal_collections`
- `budget_tiers`

Public SELECT policy:
```sql
create policy "Public read" on <table_name>
for select
using (true);
```

Admin-only write policy (reuse for each table):
```sql
create policy "Admins can write" on <table_name>
for all
using (
  exists (
    select 1
    from profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
```

## 3. Supabase schema SQL reference

Example SQL for `profiles`:
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'user',
  full_name text,
  created_at timestamp with time zone default now()
);
```

Example SQL for `wishlists`:
```sql
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  package_id uuid not null references packages(id),
  created_at timestamp with time zone default now()
);
```

Example SQL for `destinations`:
```sql
create table destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  cover_image text,
  image text,
  price numeric,
  rating numeric,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

Example SQL for `packages`:
```sql
create table packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  location text,
  image text,
  category text,
  duration text,
  pickup text,
  dates text,
  rating numeric,
  reviews int,
  price numeric,
  original_price numeric,
  overview text,
  destination_id uuid references destinations(id),
  is_top_pick boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

Example SQL for `itineraries`:
```sql
create table itineraries (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references packages(id),
  day int,
  title text,
  description text,
  created_at timestamp with time zone default now()
);
```

## 4. Notes for current app behavior

- The home page falls back to static data in `src/data/*` if Supabase queries return no rows or fail.
- The admin dashboard is protected server-side in `src/app/admin/page.tsx` by reading `profiles.role`.
- Admin upload code uses the public storage bucket `images` and then generates a public URL.
- Do not expose the Supabase service role key in frontend code.

## 5. Storage bucket setup

Create a bucket named `images` with public access if you want direct image preview URLs.
If you want private uploads, use signed URLs instead and update the code accordingly.

## 6. Recommended policy checklist

- [ ] Enable RLS on all tables
- [ ] Add `profiles` policies for user-specific access
- [ ] Add `wishlists` policies for user-specific access
- [ ] Add public `SELECT` policies for read-only content tables
- [ ] Add admin write policies for content tables
- [ ] Create and configure storage bucket `images`
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

This file is a current Supabase setup reference for Dream Travels.
