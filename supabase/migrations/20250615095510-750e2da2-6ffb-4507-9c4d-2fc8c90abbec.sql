
-- Add a 'role' column to the profiles table to distinguish between admins and regular users.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
