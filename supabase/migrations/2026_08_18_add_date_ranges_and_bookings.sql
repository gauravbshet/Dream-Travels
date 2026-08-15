-- Add available_from and available_to columns to packages
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS available_from DATE,
ADD COLUMN IF NOT EXISTS available_to DATE;

-- Create a basic bookings table with travel_date since one doesn't exist yet,
-- satisfying the request to add travel_date to bookings.
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    travel_date DATE,
    status TEXT DEFAULT 'pending'
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow authenticated users to create bookings
CREATE POLICY "Users can insert their own bookings" 
ON public.bookings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Admins (or service roles) can view/manage all bookings (bypasses RLS or handled via service key)
