-- Supabase Schema Setup for Cashflow Canvas Calendar
--
-- Instructions:
-- 1. Go to your Supabase Project Dashboard.
-- 2. Navigate to the SQL Editor.
-- 3. Create a new query.
-- 4. Copy the entire content of this file and paste it into the editor.
-- 5. Click "RUN".

-- 1. Create the user_profiles table to store public user data
-- This table will be linked to the authentication users table.
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comment on the table and columns for clarity
COMMENT ON TABLE public.user_profiles IS 'Stores public profile information for users.';
COMMENT ON COLUMN public.user_profiles.id IS 'References the internal auth.users table.';

-- 2. Create the businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comment on the table
COMMENT ON TABLE public.businesses IS 'Stores business entities or workspaces for users.';

-- 3. Create the expenses table
CREATE TABLE public.expenses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  "date" DATE NOT NULL,
  category TEXT NOT NULL,
  expense_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comment on the table
COMMENT ON TABLE public.expenses IS 'Stores individual expense records for users.';

-- 4. Set up Row Level Security (RLS)
-- Important: Enable RLS for each table to secure your data.
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
-- These policies allow users to see and manage only their own data.
CREATE POLICY "Allow users to view their own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow users to manage their own businesses"
ON public.businesses FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to manage their own expenses"
ON public.expenses FOR ALL
USING (auth.uid() = user_id);
