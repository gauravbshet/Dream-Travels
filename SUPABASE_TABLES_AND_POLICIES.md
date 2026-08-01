# Supabase Tables and RLS Policies for Dream Travels

This document describes the Supabase tables and row-level security (RLS) policies the project needs based on the current frontend usage.

The app uses Supabase Auth for both:
- email/password sign in and sign up
- Google OAuth sign in and sign up

Supabase Auth handles the core user credentials, while this schema stores profile metadata, wishlist state, destinations, packages, and itineraries.

## 1. Tables to create

### 1.1 `profiles`
Used to store user metadata and roles.

Columns:
- `id uuid` (primary key, references `auth.users.id`, default to auth user id)
- `role text` (e.g. `user`, `admin`)
- `full_name text`
- `created_at timestamp with time zone` default `now()`
- any other profile metadata you want to store

Purpose:
- `Navbar` and `Admin` pages query this table to determine user role.
- `Admin` page checks if the authenticated user has `role = 'admin'`.

### 1.2 `wishlists`
Stores packages saved by users.

Columns:
- `id uuid` (primary key)
- `user_id uuid` (references `profiles.id` or `auth.users.id`)
- `package_id uuid` (references `packages.id`)
- `created_at timestamp with time zone` default `now()`

Purpose:
- `Dashboard` page selects wishlist rows by `user_id`.
- Should only allow a user to read their own wishlist rows.

### 1.3 `destinations`
Stores travel destination data displayed on public pages.

Columns:
- `id uuid` (primary key)
- `slug text` (unique)
- `name text`
- `description text`
- `cover_image text`
- `image text`
- `price numeric`
- `rating numeric`
- `created_at timestamp with time zone` default `now()`
- any additional destination fields needed

Purpose:
- `Home` and destination detail pages read this table publicly.

### 1.4 `packages`
Stores package details that are shown publicly.

Columns:
- `id uuid` (primary key)
- `slug text` (unique)
- `title text`
- `location text`
- `image text`
- `category text`
- `duration text`
- `pickup text`
- `dates text`
- `price numeric`
- `original_price numeric`
- `overview text`
- `destination_id uuid` (references `destinations.id`)
- `is_top_pick boolean` default `false` — flags a package for the home page "Top Picks by Dream Travels" section
- `created_at timestamp with time zone` default `now()`

Purpose:
- `Home`, destination pages, and package detail pages read this table publicly.

### 1.5 `itineraries`
Stores day-by-day itinerary entries for each package.

Columns:
- `id uuid` (primary key)
- `package_id uuid` (references `packages.id`)
- `day int`
- `title text`
- `description text`
- `created_at timestamp with time zone` default `now()`

Purpose:
- `Package` detail page reads itinerary items by `package_id`.

### 1.6 `reviews`
Stores traveller testimonials shown on the home page.

Columns:
- `id uuid` (primary key)
- `name text`
- `avatar text`
- `rating int` (1-5)
- `review text`
- `date text` (free-form label, e.g. "2 weeks ago")
- `created_at timestamp with time zone` default `now()`

### 1.7 `blogs`
Stores travel story cards shown on the home page.

Columns:
- `id uuid` (primary key)
- `title text`
- `category text`
- `image text`
- `read_time text`
- `author text`
- `date text` (free-form label, e.g. "Jul 12, 2026")
- `excerpt text`
- `created_at timestamp with time zone` default `now()`

### 1.8 `events`
Stores upcoming events shown on the home page.

Columns:
- `id uuid` (primary key)
- `title text`
- `image text`
- `date text` (free-form label)
- `location text`
- `created_at timestamp with time zone` default `now()`

### 1.9 `popular_experiences`
Stores the "Popular Experiences" tiles shown on the home page.

Columns:
- `id uuid` (primary key)
- `title text`
- `image text`
- `created_at timestamp with time zone` default `now()`

### 1.10 `seasonal_collections`
Stores the "Seasonal Collections" tiles shown on the home page.

Columns:
- `id uuid` (primary key)
- `title text`
- `image text`
- `created_at timestamp with time zone` default `now()`

### 1.11 `budget_tiers`
Stores the price bands shown in the "Budget Friendly" section. The displayed count of destinations under each limit is computed live from the `destinations.price` column — it is not stored.

Columns:
- `id uuid` (primary key)
- `title text` (e.g. "Below ₹5,000")
- `emoji text`
- `price_limit numeric`
- `created_at timestamp with time zone` default `now()`

## 2. Recommended RLS policies

### 2.1 Enable RLS on all tables
For each table in Supabase, enable row-level security. Then add policies as needed.

### 2.2 `profiles`
- `SELECT`: allow if `auth.uid() = id`
- `INSERT`: allow if `auth.uid() = id`
- `UPDATE`: allow if `auth.uid() = id`
- `DELETE`: usually disable or restrict to admin only

Example policies:
- `SELECT`: `auth.uid() = id`
- `UPDATE`: `auth.uid() = id`

### 2.3 `wishlists`
- `SELECT`: allow if `auth.uid() = user_id`
- `INSERT`: allow if `auth.uid() = user_id`
- `UPDATE`: allow if `auth.uid() = user_id` (if you plan to update wishlist records)
- `DELETE`: allow if `auth.uid() = user_id`

Example policies:
- `SELECT`: `auth.uid() = user_id`
- `INSERT`: `auth.uid() = user_id`
- `DELETE`: `auth.uid() = user_id`

### 2.4 `destinations`
- `SELECT`: allow all rows publicly
- `INSERT`, `UPDATE`, `DELETE`: restrict to admin/service role only

Example policy:
- `SELECT`: `true`

### 2.5 `packages`
- `SELECT`: allow all rows publicly
- `INSERT`, `UPDATE`, `DELETE`: restrict to admin/service role only

Example policy:
- `SELECT`: `true`

### 2.6 `itineraries`
- `SELECT`: allow all rows publicly
- `INSERT`, `UPDATE`, `DELETE`: restrict to admin/service role only

Example policy:
- `SELECT`: `true`

### 2.7 `reviews`, `blogs`, `events`, `popular_experiences`, `seasonal_collections`, `budget_tiers`
Same pattern as `destinations`/`packages`: content is public to read, writes are admin-only.

- `SELECT`: allow all rows publicly (`true`)
- `INSERT`, `UPDATE`, `DELETE`: restrict to admin/service role only

A common way to restrict writes to admins across all of these tables:

```sql
create policy "Admins can write" on <table_name>
for all
using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
```

## 3. Notes for current app behavior

- The app currently uses Supabase auth on login and queries `profiles`, `wishlists`, `destinations`, `packages`, `itineraries`, `reviews`, `blogs`, `events`, `popular_experiences`, `seasonal_collections`, and `budget_tiers`.
- `destinations`, `packages`, `itineraries`, `reviews`, `blogs`, `events`, `popular_experiences`, `seasonal_collections`, and `budget_tiers` are read by public pages, so their select policy must allow unauthenticated reads.
- `profiles` and `wishlists` are user-specific and must be protected with auth-based policies.
- The app reads `role` from `profiles` to decide if a user can access admin UI.
- The home page (`src/app/page.tsx`) falls back to the static data in `src/data/*.ts` for any table that is empty or errors, so the site still renders before you've populated Supabase.
- The admin dashboard (`/admin`) has a manager for every one of these tables, including create/edit/delete with toast notifications.

## 4. Optional admin behavior

If you later add admin create/edit/delete pages, use the Supabase service role key or a server-side admin-only endpoint. Do not expose the service role key to the browser.

---

This file is meant as a Supabase setup checklist for the current Dream Travels project.
