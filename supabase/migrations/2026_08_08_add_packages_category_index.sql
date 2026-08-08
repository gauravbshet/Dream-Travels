-- ============================================================================
-- Dream Travels: index packages.category so category-page lookups
-- (GET-by-category from the frontend) don't scan the full table.
-- Supported category values are enforced at the application layer (admin
-- dropdown: solo | group | family | international) rather than a DB CHECK
-- constraint, since existing rows may carry legacy free-text categories.
-- Safe to run multiple times.
-- ============================================================================

create index if not exists idx_packages_category on public.packages (category);
