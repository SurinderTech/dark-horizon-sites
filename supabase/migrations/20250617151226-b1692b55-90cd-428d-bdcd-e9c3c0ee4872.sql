
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Remove existing cron job if it exists
DO $$
BEGIN
    PERFORM cron.unschedule('run-scheduled-twitter-poster-every-minute');
EXCEPTION
    WHEN others THEN
        NULL;
END
$$;

-- Schedule the edge function with a shorter, cleaner approach
SELECT cron.schedule(
  'run-scheduled-twitter-poster-every-minute',
  '* * * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://qaojozbqboktlhtyvyrd.supabase.co/functions/v1/scheduled-twitter-poster',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhb2pvemJxYm9rdGxodHl2eXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjE0MDAsImV4cCI6MjA2MzU5NzQwMH0.N-IkS2bmj34mTm03rjwKfqqGOK4iVB3319DTYHzbD8I"}'::jsonb,
    body := '{}'::jsonb
  );
  $cron$
);
